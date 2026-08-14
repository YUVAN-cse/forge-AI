import {
    getRepositoryFileService,
} from "./repositoryFile.service.js";

import {
    parseDependencyFile,
} from "./dependencyParser.service.js";
import { analyzeDependencies } from "./codebaseUnderstanding.service.js";

export const analyzeDependencies = async (
    repositoryId,
    userId,
    tree
) => {

    const importantFiles =
        getImportantFiles(tree);

    const dependencies = [];

    for (const filePath of importantFiles) {

        try {

            const file =
                await getRepositoryFileService(
                    repositoryId,
                    userId,
                    filePath
                );

            const result =
                parseDependencyFile(
                    filePath,
                    file.content
                );

            dependencies.push({
                file: filePath,
                ...result,
            });

        } catch (error) {

            console.error(
                `Failed to analyze ${filePath}:`,
                error.message
            );

        }

    }

    return dependencies;
};

const CONFIG_FILES = [
    "package.json",
    "requirements.txt",
    "pom.xml",
    "build.gradle",
];

export const getImportantFiles = (tree) => {

    const paths = tree
        .filter((item) => item.type === "blob")
        .map((item) => item.path);

    return paths.filter((path) => {

        const fileName = path
            .split("/")
            .pop()
            .toLowerCase();

        return CONFIG_FILES.includes(fileName);

    });

};

export const buildCodebaseUnderstanding = async (
    tree,
    repositoryId,
    userId
) => {

    const paths = tree.map(
        (item) => item.path.toLowerCase()
    );


    // ==========================================
    // INITIAL STRUCTURE
    // ==========================================

    const understanding = {

        entryPoints: [],

        folders: {},

        importantFiles: [],

        configurations: [],

        dependencies: [],

    };


    // ==========================================
    // IMPORTANT FOLDERS
    // ==========================================

    const folderNames = [

        "controllers",
        "services",
        "routes",
        "models",
        "middleware",
        "config",
        "utils",
        "helpers",

        "client",
        "server",
        "src",

        "public",
        "components",
        "pages",
        "app",

    ];


    folderNames.forEach((folder) => {

        understanding.folders[folder] =
            paths.some(
                (path) =>
                    path.includes(`/${folder}/`) ||
                    path.startsWith(`${folder}/`)
            );

    });


    // ==========================================
    // IMPORTANT FILES
    // ==========================================

    const importantFiles = [

        "package.json",
        "package-lock.json",

        "dockerfile",
        "docker-compose.yml",

        ".env.example",

        "readme.md",

        "tsconfig.json",

        "next.config.js",
        "next.config.mjs",
        "next.config.ts",

        "vite.config.js",
        "vite.config.ts",

        "pom.xml",

        "manage.py",

    ];


    importantFiles.forEach((file) => {

        if (paths.includes(file)) {

            understanding.importantFiles.push(file);

        }

    });


    // ==========================================
    // ENTRY POINT DETECTION
    // ==========================================

    const entryCandidates = [

        "server/src/server.js",
        "server/src/index.js",

        "server/server.js",
        "server/index.js",

        "src/server.js",
        "src/index.js",

        "server.js",
        "index.js",
        "app.js",

    ];


    entryCandidates.forEach((file) => {

        if (paths.includes(file)) {

            understanding.entryPoints.push(file);

        }

    });


    // ==========================================
    // CONFIGURATION FILES
    // ==========================================

    const configurationFiles = [

        ".env",
        ".env.example",

        "tsconfig.json",

        "next.config.js",
        "next.config.mjs",
        "next.config.ts",

        "vite.config.js",
        "vite.config.ts",

        "webpack.config.js",

        "dockerfile",
        "docker-compose.yml",

    ];


    configurationFiles.forEach((file) => {

        if (paths.includes(file)) {

            understanding.configurations.push(file);

        }

    });

    const dependencyAnalysis =
    await analyzeDependencies(
        repositoryId,
        userId,
        tree
    );

    understanding.dependencies =
    dependencyAnalysis;


    // ==========================================
    // RETURN UNDERSTANDING
    // ==========================================

    return understanding;

};