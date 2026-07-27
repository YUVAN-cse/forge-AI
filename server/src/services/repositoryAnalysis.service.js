import Repository from "../models/repository.model.js";
import GithubAccount from "../models/githubAccount.model.js";
import RepositoryAnalysis from "../models/repositoryAnalysis.model.js";
import { getRepositoryTreeService } from "./github.service.js";

export const analyzeRepositoryService = async (repositoryId) => {

    const repository = await Repository.findById(repositoryId);

    if (!repository) {
        throw new Error("Repository not found.");
    }

    const githubAccount = await GithubAccount.findOne({
        user: repository.importedBy,
    });

    if (!githubAccount) {
        throw new Error("GitHub account not connected.");
    }

    const tree = await getRepositoryTreeService(
        githubAccount.accessToken,
        repository.owner,
        repository.name,
        repository.defaultBranch
    );

    const paths = tree.map((item) => item.path.toLowerCase());

    const analysis = {

        languages: [],

        framework: null,

        packageManager: null,

        hasFrontend: false,

        hasBackend: false,

        hasDocker: false,

        hasReadme: false,

        defaultBranch: repository.defaultBranch,

        totalFiles: tree.filter(item => item.type === "blob").length,

        totalDirectories: tree.filter(item => item.type === "tree").length,
    };


    analysis.hasReadme = paths.some(path => path === "readme.md");
    analysis.hasDocker = paths.some(path => path === "dockerfile");
    analysis.hasFrontend =
    paths.some(path => path.startsWith("client/")) ||
    paths.some(path => path.startsWith("src/"));

    analysis.hasBackend =
    paths.some(path => path.startsWith("server/")) ||
    paths.some(path => path.startsWith("api/"));

    if (paths.some(path => path.endsWith(".js")))
    analysis.languages.push("JavaScript");

if (paths.some(path => path.endsWith(".ts")))
    analysis.languages.push("TypeScript");

if (paths.some(path => path.endsWith(".java")))
    analysis.languages.push("Java");

if (paths.some(path => path.endsWith(".py")))
    analysis.languages.push("Python");

if (paths.some(path => path.endsWith(".cpp")))
    analysis.languages.push("C++");

if (paths.includes("package-lock.json"))
    analysis.packageManager = "npm";

else if (paths.includes("yarn.lock"))
    analysis.packageManager = "yarn";

else if (paths.includes("pnpm-lock.yaml"))
    analysis.packageManager = "pnpm";


if (
    paths.includes("package.json") &&
    analysis.hasFrontend &&
    analysis.hasBackend
) {
    analysis.framework = "MERN";
}
else if (paths.includes("next.config.js")) {
    analysis.framework = "Next.js";
}
else if (paths.includes("pom.xml")) {
    analysis.framework = "Spring Boot";
}
else if (paths.includes("manage.py")) {
    analysis.framework = "Django";
}

const existingAnalysis = await RepositoryAnalysis.findOne({
    repository: repository._id,
});

if (existingAnalysis) {

    await RepositoryAnalysis.findByIdAndUpdate(
        existingAnalysis._id,
        analysis
    );

    return analysis;
}

await RepositoryAnalysis.create({

    repository: repository._id,

    ...analysis,
});

return analysis;
};