import GithubAccount from "../models/githubAccount.model.js";
import Repository from "../models/repository.model.js";
import { getRepositoryFileService } from "./repositoryFile.service.js";

export const getCodeFilesForAnalysis = async (
    repositoryId,
    userId,
    tree
) => {

    const repository =
        await Repository.findById(repositoryId);

    if (!repository) {
        throw new Error("Repository not found.");
    }

    if (
        repository.importedBy.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "You are not authorized to analyze this repository."
        );
    }


    const githubAccount =
        await GithubAccount.findOne({
            user: userId,
        });

    if (!githubAccount) {
        throw new Error(
            "GitHub account not connected."
        );
    }


    const sourceFiles =
        tree.filter((item) => {

            if (item.type !== "blob") {
                return false;
            }

            const path =
                item.path.toLowerCase();

            return (
                path.endsWith(".js") ||
                path.endsWith(".ts") ||
                path.endsWith(".jsx") ||
                path.endsWith(".tsx") ||
                path.endsWith(".mjs") ||
                path.endsWith(".cjs")
            );

        });


    const files = [];

    for (const file of sourceFiles) {

        const result =
            await getRepositoryFileService(
                repositoryId,
                userId,
                file.path
            );

        files.push({

            path: file.path,

            content: result.content,

        });

    }


    return files;

};