import Repository from "../models/repository.model.js";
import GithubAccount from "../models/githubAccount.model.js";
import RepositoryAnalysis from "../models/repositoryAnalysis.model.js";
import { getRepositoryTreeService } from "./github.service.js";

export const analyzeRepositoryService = async (
    repositoryId,
    userId
) => {

    // ==========================================
    // FIND REPOSITORY
    // ==========================================

    const repository =
        await Repository.findById(repositoryId);

    if (!repository) {
        throw new Error(
            "Repository not found."
        );
    }


    // ==========================================
    // AUTHORIZATION
    // ==========================================

    if (
        repository.importedBy.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "You are not authorized to analyze this repository."
        );
    }


    // ==========================================
    // FIND GITHUB ACCOUNT
    // ==========================================

    const githubAccount =
        await GithubAccount.findOne({
            user: repository.importedBy,
        });

    if (!githubAccount) {
        throw new Error(
            "GitHub account not connected."
        );
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    repository.analysisStatus =
        "ANALYZING";

    await repository.save();


    try {

        // ==========================================
        // FETCH REPOSITORY TREE
        // ==========================================

        const tree =
            await getRepositoryTreeService(
                githubAccount.accessToken,
                repository.owner,
                repository.name,
                repository.defaultBranch
            );


        // ==========================================
        // EXTRACT PATHS
        // ==========================================

        const paths =
            tree.map(
                (item) =>
                    item.path.toLowerCase()
            );


        // ==========================================
        // INITIAL ANALYSIS
        // ==========================================

        const analysis = {

            languages: [],

            framework: null,

            packageManager: null,

            hasFrontend: false,

            hasBackend: false,

            hasDocker: false,

            hasReadme: false,

            defaultBranch:
                repository.defaultBranch,

            totalFiles:
                tree.filter(
                    (item) =>
                        item.type === "blob"
                ).length,

            totalDirectories:
                tree.filter(
                    (item) =>
                        item.type === "tree"
                ).length,

        };


        // ==========================================
        // README
        // ==========================================

        analysis.hasReadme =
            paths.some(
                (path) =>
                    path === "readme.md"
            );


        // ==========================================
        // DOCKER
        // ==========================================

        analysis.hasDocker =
            paths.some(
                (path) =>
                    path === "dockerfile"
            );


        // ==========================================
        // FRONTEND DETECTION
        // ==========================================

        analysis.hasFrontend =
            paths.some(
                (path) =>
                    path.startsWith("client/")
            ) ||
            paths.some(
                (path) =>
                    path.startsWith("frontend/")
            ) ||
            paths.some(
                (path) =>
                    path.startsWith("src/")
            );


        // ==========================================
        // BACKEND DETECTION
        // ==========================================

        analysis.hasBackend =
            paths.some(
                (path) =>
                    path.startsWith("server/")
            ) ||
            paths.some(
                (path) =>
                    path.startsWith("backend/")
            ) ||
            paths.some(
                (path) =>
                    path.startsWith("api/")
            );


        // ==========================================
        // LANGUAGE DETECTION
        // ==========================================

        if (
            paths.some(
                (path) =>
                    path.endsWith(".js")
            )
        ) {
            analysis.languages.push(
                "JavaScript"
            );
        }


        if (
            paths.some(
                (path) =>
                    path.endsWith(".ts")
            )
        ) {
            analysis.languages.push(
                "TypeScript"
            );
        }


        if (
            paths.some(
                (path) =>
                    path.endsWith(".java")
            )
        ) {
            analysis.languages.push(
                "Java"
            );
        }


        if (
            paths.some(
                (path) =>
                    path.endsWith(".py")
            )
        ) {
            analysis.languages.push(
                "Python"
            );
        }


        if (
            paths.some(
                (path) =>
                    path.endsWith(".cpp")
            )
        ) {
            analysis.languages.push(
                "C++"
            );
        }


        // ==========================================
        // PACKAGE MANAGER
        // ==========================================

        if (
            paths.includes(
                "package-lock.json"
            )
        ) {

            analysis.packageManager =
                "npm";

        } else if (
            paths.includes(
                "yarn.lock"
            )
        ) {

            analysis.packageManager =
                "yarn";

        } else if (
            paths.includes(
                "pnpm-lock.yaml"
            )
        ) {

            analysis.packageManager =
                "pnpm";

        }


        // ==========================================
        // FRAMEWORK DETECTION
        // ==========================================

        if (
            paths.includes(
                "next.config.js"
            ) ||
            paths.includes(
                "next.config.mjs"
            ) ||
            paths.includes(
                "next.config.ts"
            )
        ) {

            analysis.framework =
                "Next.js";

        } else if (
            paths.includes(
                "pom.xml"
            )
        ) {

            analysis.framework =
                "Spring Boot";

        } else if (
            paths.includes(
                "manage.py"
            )
        ) {

            analysis.framework =
                "Django";

        } else if (
            paths.includes(
                "package.json"
            ) &&
            analysis.hasFrontend &&
            analysis.hasBackend
        ) {

            analysis.framework =
                "MERN";

        }


        // ==========================================
        // SAVE / UPDATE ANALYSIS
        // ==========================================

        const existingAnalysis =
            await RepositoryAnalysis.findOne({
                repository:
                    repository._id,
            });


        if (existingAnalysis) {

            await RepositoryAnalysis.findByIdAndUpdate(
                existingAnalysis._id,
                analysis
            );

        } else {

            await RepositoryAnalysis.create({

                repository:
                    repository._id,

                ...analysis,

            });

        }


        // ==========================================
        // UPDATE REPOSITORY STATUS
        // ==========================================

        repository.analysisStatus =
            "ANALYZED";

        repository.analyzedAt =
            new Date();

        await repository.save();


        return analysis;


    } catch (error) {

        // ==========================================
        // ANALYSIS FAILED
        // ==========================================

        repository.analysisStatus =
            "FAILED";

        await repository.save();

        throw error;

    }

};