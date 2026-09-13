import path from "path";


// ==========================================
// EXTRACT IMPORTS
// ==========================================

// ==========================================
// EXTRACT IMPORTS
// ==========================================

const extractImports = (content) => {

    const imports = [];

    // ES module imports
    const importRegex =
        /import\s+([\s\S]*?)\s+from\s+["']([^"']+)["']/g;

    let match;

    while ((match = importRegex.exec(content)) !== null) {

        const importedPart = match[1].trim();
        const importPath = match[2];

        const names = [];

        // import createProject from "..."
        if (
            !importedPart.startsWith("{") &&
            !importedPart.startsWith("*")
        ) {
            const defaultImport =
                importedPart.split(",")[0].trim();

            if (defaultImport) {
                names.push(defaultImport);
            }
        }

        // import { createProject, deleteProject } from "..."
        const namedMatch =
            importedPart.match(/\{([\s\S]*?)\}/);

        if (namedMatch) {

            namedMatch[1]
                .split(",")
                .forEach((item) => {

                    const parts =
                        item.trim().split(/\s+as\s+/);

                    if (parts[1]) {
                        names.push(parts[1].trim());
                    } else if (parts[0]) {
                        names.push(parts[0].trim());
                    }

                });
        }

        // import * as projectService from "..."
        const namespaceMatch =
            importedPart.match(
                /\*\s+as\s+([A-Za-z_$][\w$]*)/
            );

        if (namespaceMatch) {
            names.push(namespaceMatch[1]);
        }

        imports.push({
            path: importPath,
            names,
        });
    }


    // CommonJS require
    const requireRegex =
        /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*require\(\s*["']([^"']+)["']\s*\)/g;

    while ((match = requireRegex.exec(content)) !== null) {

        imports.push({
            path: match[2],
            names: [match[1]],
        });
    }


    return imports;
};


// ==========================================
// RESOLVE IMPORT PATH
// ==========================================

const resolveImportPath = (
    currentFile,
    importPath,
    repositoryFiles
) => {

    // Ignore external packages
    if (!importPath.startsWith(".")) {
        return null;
    }


    const currentDirectory =
        path.posix.dirname(currentFile);


    const basePath =
        path.posix.normalize(
            path.posix.join(
                currentDirectory,
                importPath
            )
        );


    const possiblePaths = [

        basePath,

        `${basePath}.js`,

        `${basePath}.ts`,

        `${basePath}.jsx`,

        `${basePath}.tsx`,

        `${basePath}.mjs`,

        `${basePath}.cjs`,

        `${basePath}/index.js`,

        `${basePath}/index.ts`,

    ];


    return (
        possiblePaths.find(
            (filePath) =>
                repositoryFiles.has(filePath)
        ) || null
    );

};

// ==========================================
// EXTRACT FUNCTION CALLS
// ==========================================

const extractFunctionCalls = (content) => {

    const calls = [];

    // Matches:
    // createProject(...)
    // projectService.createProject(...)
    // userService.getUser(...)
    const functionCallRegex =
        /\b([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)?)\s*\(/g;

    let match;
    // Ignore common language constructs
    const ignoredCalls = new Set([
        "if",
        "for",
        "while",
        "switch",
        "catch",
        "function",
        "return",
        "console.log",
        "console.error",
        "console.warn",
    ]);

    while ((match = functionCallRegex.exec(content)) !== null) {

        const call = match[1];

        if (ignoredCalls.has(call)) {
            continue;
        }

        calls.push(call);
    }

    return calls;
};

// ==========================================
// BUILD SEMANTIC RELATIONSHIPS
// ==========================================

// EXTRACT MODEL CALLS
const extractModelCalls = (content, importedNames) => {
    const calls = [];

    importedNames.forEach((name) => {
        const modelCallRegex =
            new RegExp(
                `\\b${name}\\.(find|findOne|findById|findByIdAndUpdate|findByIdAndDelete|create|updateOne|updateMany|deleteOne|deleteMany|findOneAndUpdate|findOneAndDelete|countDocuments|exists)\\s*\\(`,
                "g"
            );

        let match;

        while ((match = modelCallRegex.exec(content)) !== null) {
            calls.push({
                symbol: name,
                method: match[1],
            });
        }
    });

    return calls;
};

const buildSemanticRelationships = (
    files,
    basicRelationships
) => {

    const relationships = [];

    const fileMap = new Map(
        files.map((file) => [
            file.path,
            file.content
        ])
    );


    files.forEach((file) => {

        const imports =
            extractImports(file.content);

        const calls =
    extractFunctionCalls(file.content);

const modelCalls =
    extractModelCalls(
        file.content,
        importInfo.names
    );


        imports.forEach((importInfo) => {
    const target =
        basicRelationships.find(
            (relationship) =>
                relationship.from === file.path &&
                relationship.to ===
                    resolveImportPath(
                        file.path,
                        importInfo.path,
                        new Set(fileMap.keys())
                    )
        );

    if (!target) {
        return;
    }

    const targetFile = target.to;

    const fromRole =
        getFileRole(file.path);

    const toRole =
        getFileRole(targetFile);

    const modelCalls =
        extractModelCalls(
            file.content,
            importInfo.names
        );

    modelCalls.forEach((call) => {
        if (toRole !== "models") {
            return;
        }

        relationships.push({
            from: file.path,
            to: targetFile,
            type: "service_uses_model",
            symbol: call.symbol,
            method: call.method,
        });
    });

    importInfo.names.forEach((name) => {
        if (!calls.includes(name)) {
            return;
        }

        const relationshipType =
            classifyRelationship(
                fromRole,
                toRole
            );

        relationships.push({
            from: file.path,
            to: targetFile,
            type: relationshipType,
            symbol: name,
        });
    });
});

    });


    return relationships;
};

// ==========================================
// BUILD RELATIONSHIPS
// ==========================================

export const buildCodeRelationships = (
    files,
    codeStructure
) => {

    const repositoryFiles =
        new Set(
            files.map(
                (file) => file.path
            )
        );


    const relationships = [];


    files.forEach((file) => {

        if (
            !file.path.endsWith(".js") &&
            !file.path.endsWith(".ts") &&
            !file.path.endsWith(".jsx") &&
            !file.path.endsWith(".tsx") &&
            !file.path.endsWith(".mjs") &&
            !file.path.endsWith(".cjs")
        ) {
            return;
        }


        const imports =
            extractImports(file.content);


        imports.forEach((importInfo) => {

            const target =
                resolveImportPath(
                    file.path,
                    importInfo.path,
                    repositoryFiles
                );


            if (!target) {
                return;
            }


            relationships.push({

                from: file.path,

                to: target,

                type: "imports",

            });

        });

    });


    const semanticRelationships =
        buildSemanticRelationships(
            files,
            relationships
        );


    return [
        ...relationships,
        ...semanticRelationships
    ];

};

// ==========================================
// GET FILE ROLE
// ==========================================

const getFileRole = (filePath) => {

    const path = filePath.toLowerCase();

    if (
        path.includes("/routes/") ||
        path.includes("/route/") ||
        path.includes("routes.")
    ) {
        return "routes";
    }

    if (
        path.includes("/controllers/") ||
        path.includes("/controller/") ||
        path.includes("controllers.")
    ) {
        return "controllers";
    }

    if (
        path.includes("/services/") ||
        path.includes("/service/") ||
        path.includes("services.")
    ) {
        return "services";
    }

    if (
    path.includes("/models/") ||
    path.includes("/model/") ||
    path.includes("models.") ||
    path.includes(".model.")
) {
    return "models";
}

    if (
        path.includes("/middleware/") ||
        path.includes("/middlewares/") ||
        path.includes("middleware.")
    ) {
        return "middleware";
    }

    return "unknown";
};

// ==========================================
// CLASSIFY SEMANTIC RELATIONSHIP
// ==========================================
const classifyRelationship = (
    fromRole,
    toRole
) => {

    if (
        fromRole === "routes" &&
        toRole === "controllers"
    ) {
        return "route_calls_controller";
    }

    if (
        fromRole === "controllers" &&
        toRole === "services"
    ) {
        return "controller_calls_service";
    }

    if (
        fromRole === "services" &&
        toRole === "models"
    ) {
        return "service_uses_model";
    }

    if (
        fromRole === "controllers" &&
        toRole === "middleware"
    ) {
        return "controller_uses_middleware";
    }

    if (
        fromRole === "routes" &&
        toRole === "middleware"
    ) {
        return "route_uses_middleware";
    }

    return "calls";
};

