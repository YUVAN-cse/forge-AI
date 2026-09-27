// DETECT ORPHAN FILES
export const detectOrphanFiles = (
    files,
    relationships,
    entryPoints = []
) => {
    const connectedFiles = new Set();

    relationships.forEach((relationship) => {
        connectedFiles.add(relationship.from);
        connectedFiles.add(relationship.to);
    });

    const excludedFiles = new Set(
        entryPoints
    );

    files.forEach((file) => {
        const fileName =
            file.path
                .split("/")
                .pop()
                .toLowerCase();

        if (
            fileName === "readme.md" ||
            fileName === "package.json" ||
            fileName === "package-lock.json" ||
            fileName === "yarn.lock" ||
            fileName === "pnpm-lock.yaml" ||
            fileName === ".gitignore" ||
            fileName === "dockerfile"
        ) {
            excludedFiles.add(file.path);
        }
    });

    return files
        .filter(
            (file) =>
                !connectedFiles.has(file.path) &&
                !excludedFiles.has(file.path)
        )
        .map((file) => file.path);
};