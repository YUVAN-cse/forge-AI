
import {
    getRepositoryFileService,
} from "./repositoryFile.service.js";

import {
    generateCodeReview,
} from "./ai.service.js";

const MAX_CODE_CHARS = 20000;

export const reviewRepositoryFile = async ({
    repositoryId,
    userId,
    filePath,
}) => {
    if (
        typeof filePath !== "string" ||
        !filePath.trim() ||
        filePath.length > 1000
    ) {
        const error = new Error("Invalid file path.");
        error.statusCode = 400;
        throw error;
    }

    const normalizedPath = filePath.trim();

    if (
        normalizedPath.startsWith("/") ||
        normalizedPath.includes("\\") ||
        normalizedPath.split("/").includes("..")
    ) {
        const error = new Error("Invalid repository file path.");
        error.statusCode = 400;
        throw error;
    }

    if (
        /(^|\/)\.env(?:\..*)?$|(^|\/)(.*\.pem|.*\.key)$/i.test(
            normalizedPath
        )
    ) {
        const error = new Error(
            "Reviewing sensitive configuration files is not supported."
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        !/\.(js|jsx|ts|tsx|mjs|cjs|py|java|go|rs|cpp|c|h|cs)$/i.test(
            normalizedPath
        )
    ) {
        const error = new Error(
            "Unsupported source file type."
        );
        error.statusCode = 400;
        throw error;
    }

    const file = await getRepositoryFileService(
        repositoryId,
        userId,
        normalizedPath
    );

    if (
        !file ||
        typeof file.content !== "string" ||
        !file.content.trim()
    ) {
        const error = new Error(
            "Source file is empty or unavailable."
        );
        error.statusCode = 400;
        throw error;
    }

    const truncated =
        file.content.length > MAX_CODE_CHARS;

    const content = file.content.slice(
        0,
        MAX_CODE_CHARS
    );

    const review = await generateCodeReview({
        filePath: normalizedPath,
        content,
    });

    return {
        filePath: normalizedPath,
        truncated,
        review,
    };
};
