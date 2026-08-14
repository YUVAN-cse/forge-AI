// ==========================================
// PACKAGE.JSON
// ==========================================

export const parsePackageJson = (content) => {

    const data = JSON.parse(content);

    const dependencies = Object.keys(
        data.dependencies || {}
    );

    const devDependencies = Object.keys(
        data.devDependencies || {}
    );

    return {
        packageManager: "npm",
        dependencies,
        devDependencies,
    };
};


// ==========================================
// REQUIREMENTS.TXT
// ==========================================

export const parseRequirementsTxt = (content) => {

    const dependencies = content
        .split("\n")
        .map(line => line.trim())
        .filter(line =>
            line &&
            !line.startsWith("#") &&
            !line.startsWith("-")
        )
        .map(line => {

            return line
                .split(/[<>=!~]/)[0]
                .trim();

        });

    return {
        packageManager: "pip",
        dependencies,
        devDependencies: [],
    };
};


// ==========================================
// POM.XML
// ==========================================

export const parsePomXml = (content) => {

    const dependencies = [];

    const matches = content.matchAll(
        /<artifactId>(.*?)<\/artifactId>/g
    );

    for (const match of matches) {

        dependencies.push(
            match[1]
        );

    }

    return {
        packageManager: "maven",
        dependencies,
        devDependencies: [],
    };
};


// ==========================================
// BUILD.GRADLE
// ==========================================

export const parseBuildGradle = (content) => {

    const dependencies = [];

    const matches = content.matchAll(
        /(?:implementation|api|compileOnly|runtimeOnly)\s+['"]([^'"]+)['"]/g
    );

    for (const match of matches) {

        dependencies.push(
            match[1]
        );

    }

    return {
        packageManager: "gradle",
        dependencies,
        devDependencies: [],
    };
};

export const parseDependencyFile = (
    filePath,
    content
) => {

    const fileName =
        filePath
            .split("/")
            .pop()
            .toLowerCase();


    try {

        if (fileName === "package.json") {

            return parsePackageJson(content);

        }


        if (fileName === "requirements.txt") {

            return parseRequirementsTxt(content);

        }


        if (fileName === "pom.xml") {

            return parsePomXml(content);

        }


        if (fileName === "build.gradle") {

            return parseBuildGradle(content);

        }


        return {
            packageManager: null,
            dependencies: [],
            devDependencies: [],
        };

    } catch (error) {

        console.error(
            `Failed to parse ${filePath}:`,
            error
        );

        return {
            packageManager: null,
            dependencies: [],
            devDependencies: [],
        };

    }

};