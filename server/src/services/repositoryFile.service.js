import axios from "axios";
import Repository from "../models/repository.model.js";
import GithubAccount from "../models/githubAccount.model.js";

export const getRepositoryFileService = async (
    repositoryId,
    userId,
    path
) => {

    const repository = await Repository.findById(repositoryId);

    if (!repository) {
        throw new Error("Repository not found.");
    }

    const githubAccount = await GithubAccount.findOne({
        user: userId,
    });

    if (!githubAccount) {
        throw new Error("GitHub account not connected.");
    }

    const response = await axios.get(
        `https://api.github.com/repos/${repository.owner}/${repository.name}/contents/${path}`,
        {
            headers: {
                Authorization: `Bearer ${githubAccount.accessToken}`,
            },
            params: {
                ref: repository.defaultBranch,
            },
        }
    );

    const content = Buffer.from(
        response.data.content,
        "base64"
    ).toString("utf-8");

    return {
        name: response.data.name,
        path: response.data.path,
        sha: response.data.sha,
        size: response.data.size,
        content,
    };
};