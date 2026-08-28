import path from "path";


// ==========================================
// EXTRACT IMPORTS
// ==========================================

const extractImports = (content) => {

    const imports = [];

    // ES module imports
    const importRegex =
        /import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

    // CommonJS requires
    const requireRegex =
        /require\(\s*["']([^"']+)["']\s*\)/g;


    let match;


    while ((match = importRegex.exec(content)) !== null) {

        imports.push(match[1]);

    }


    while ((match = requireRegex.exec(content)) !== null) {

        imports.push(match[1]);

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
// BUILD RELATIONSHIPS
// ==========================================

export const buildCodeRelationships = (
    files
) => {

    const repositoryFiles =
        new Set(
            files.map(
                (file) => file.path
            )
        );


    const relationships = [];


    files.forEach((file) => {

        // Only inspect source files
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
            extractImports(
                file.content
            );


        imports.forEach((importPath) => {

            const target =
                resolveImportPath(
                    file.path,
                    importPath,
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


    return relationships;

};