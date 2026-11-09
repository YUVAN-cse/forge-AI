
import {
    getCodeFilesForAnalysis,
} from "./codeFileContent.service.js";

import {
    buildCodeStructure,
} from "./codeStructure.service.js";

import {
    buildCodeRelationships,
} from "./codeRelationship.service.js";

import {
    buildArchitectureGraph,
} from "./architectureGraph.service.js";

import {
    buildArchitectureInsights,
} from "./architectureInsights.service.js";

import {
    generateUMLDiagram,
} from "./ai.service.js";

const SUPPORTED_DIAGRAMS = [
    "class",
    "sequence",
    "component",
];

const MAX_FILES = 5;
const MAX_FILE_CHARS = 900;
const MAX_TOTAL_CHARS = 4000;

const getFilePriority = (path, diagramType) => {
    const value = path.toLowerCase();

    const priorities = {
        class: [
            "models",
            "entities",
            "services",
            "controllers",
            "components",
        ],
        sequence: [
            "routes",
            "controllers",
            "services",
            "middleware",
            "models",
        ],
        component: [
            "app",
            "server",
            "config",
            "routes",
            "components",
            "services",
        ],
    };

    const index = priorities[diagramType].findIndex(
        (folder) => value.includes(`/${folder}/`) ||
            value.startsWith(`${folder}/`)
    );

    return index === -1 ? 100 : index;
};

const prepareUMLContext = (
    files,
    relationships,
    diagramType
) => {
    const sortedFiles = [...files].sort(
        (a, b) =>
            getFilePriority(a.path, diagramType) -
            getFilePriority(b.path, diagramType)
    );

    const selectedFiles = [];
    let totalChars = 0;

    for (const file of sortedFiles) {
        if (selectedFiles.length >= MAX_FILES) break;
        if (totalChars >= MAX_TOTAL_CHARS) break;

        const remaining =
            MAX_TOTAL_CHARS - totalChars;

        const content = file.content.slice(
            0,
            Math.min(MAX_FILE_CHARS, remaining)
        );

        if (!content.trim()) continue;

        selectedFiles.push({
            path: file.path,
            content,
        });

        totalChars += content.length;
    }

    const selectedPaths = new Set(
        selectedFiles.map((file) => file.path)
    );

    const selectedRelationships =
        relationships.filter(
            (relationship) =>
                selectedPaths.has(relationship.from) &&
                selectedPaths.has(relationship.to)
        ).slice(0, 100);

    return {
        files: selectedFiles,
        relationships: selectedRelationships,
    };
};

export const generateRepositoryUML = async ({
    tree,
    repositoryId,
    userId,
    diagramType,
}) => {

    if (!SUPPORTED_DIAGRAMS.includes(diagramType)) {
        throw new Error("Invalid UML diagram type.");
    }

    const codeStructure =
        buildCodeStructure(tree);

    const files =
        await getCodeFilesForAnalysis(
            repositoryId,
            userId,
            tree
        );

    const relationships =
        buildCodeRelationships(
            files,
            codeStructure
        );

    const architectureGraph =
        buildArchitectureGraph(
            files,
            relationships
        );

    const architectureInsights =
        buildArchitectureInsights(
            architectureGraph,
            files,
            []
        );

    const context = prepareUMLContext(
        files,
        relationships,
        diagramType
    );

    return await generateUMLDiagram({
        diagramType,
        files: context.files,
        relationships: context.relationships,
        architectureInsights,
    });

};
