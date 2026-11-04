
import {
    getRepositoryTreeForProjectService,
} from "./repository.service.js";

import {
    getRepositoryFileService,
} from "./repositoryFile.service.js";

const MAX_FILES = 8;
const MAX_FILE_CHARS = 7000;
const MAX_TOTAL_CHARS = 32000;

const SOURCE_EXTENSIONS =
    /\.(js|jsx|ts|tsx|mjs|cjs|py|java|go|rs|cpp|c|h|cs)$/i;

const SKIP_PATH =
    /(^|\/)(node_modules|dist|build|coverage|vendor|\.next|\.git)(\/|$)/i;

const SECRET_FILE =
    /(^|\/)\.env(?:\..*)?$|(^|\/)(id_rsa|id_ed25519|.*\.pem|.*\.key)$/i;

const tokenize = (value) =>
    String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 2);

const getSearchTerms = (question) => {
    const stopWords = new Set([
        "the", "and", "for", "how", "what",
        "where", "which", "does", "this",
        "that", "with", "from", "are",
        "can", "you", "explain", "show",
        "find", "file", "files", "code",
        "repository", "project",
    ]);

    return [
        ...new Set(
            tokenize(question).filter(
                (word) => !stopWords.has(word)
            )
        ),
    ];
};

const scoreFile = (filePath, terms) => {
    const lowerPath = filePath.toLowerCase();
    const tokens = new Set(tokenize(filePath));
    const fileName = filePath.split("/").pop().toLowerCase();

    let score = 0;

    for (const term of terms) {
        if (tokens.has(term)) {
            score += 5;
        } else if (lowerPath.includes(term)) {
            score += 2;
        }

        if (fileName.includes(term)) {
            score += 3;
        }
    }

    if (/readme\.md$/i.test(filePath)) {
        score += 1;
    }

    return score;
};

const getCandidates = (tree) => {
    return tree
        .filter((item) => item.type === "blob")
        .map((item) => item.path)
        .filter(
            (filePath) =>
                (SOURCE_EXTENSIONS.test(filePath) ||
                    /(^|\/)(readme\.md|package\.json)$/i.test(filePath)) &&
                !SKIP_PATH.test(filePath) &&
                !SECRET_FILE.test(filePath)
        );
};

export const buildRepositoryContext = async ({
    repositoryId,
    userId,
    question,
}) => {
    const result =
        await getRepositoryTreeForProjectService(
            repositoryId,
            userId
        );

    const tree = result.tree;

    if (!Array.isArray(tree)) {
        throw new Error("Invalid repository tree.");
    }

    const terms = getSearchTerms(question);

    const rankedPaths = getCandidates(tree)
        .map((filePath) => ({
            path: filePath,
            score: scoreFile(filePath, terms),
        }))
        .sort(
            (a, b) =>
                b.score - a.score ||
                a.path.localeCompare(b.path)
        );

    const selectedFiles = [];
    let totalChars = 0;

    for (const candidate of rankedPaths) {
        if (selectedFiles.length >= MAX_FILES) {
            break;
        }

        if (totalChars >= MAX_TOTAL_CHARS) {
            break;
        }

        try {
            const file = await getRepositoryFileService(
                repositoryId,
                userId,
                candidate.path
            );

            if (typeof file?.content !== "string") {
                continue;
            }

            const remaining =
                MAX_TOTAL_CHARS - totalChars;

            const content = file.content.slice(
                0,
                Math.min(MAX_FILE_CHARS, remaining)
            );

            if (!content.trim()) {
                continue;
            }

            selectedFiles.push({
                path: candidate.path,
                content,
                truncated:
                    content.length < file.content.length,
            });

            totalChars += content.length;
        } catch (error) {
            console.error(
                `Failed to retrieve ${candidate.path}:`,
                error.message
            );
        }
    }

    return {
        repositoryId,
        question,
        files: selectedFiles,
        retrievedFilePaths: selectedFiles.map(
            (file) => file.path
        ),
        totalCandidateFiles: rankedPaths.length,
        retrievalStrategy: "filename-keyword",
    };
};
