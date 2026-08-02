import Repository from "../models/repository.model.js";

import GithubAccount from "../models/githubAccount.model.js";
import {
    getRepositoryTreeService,
} from "./github.service.js";

export const importRepositoryService = async (
    projectId,
    repository,
    userId
) => {

    const existingRepository = await Repository.findOne({
        project: projectId,
        githubRepoId: repository.githubRepoId,
    });
    if (existingRepository) {
        throw new Error("Repository already imported.");
    }

    return await Repository.create({

        project: projectId,

        githubRepoId: repository.githubRepoId,

        name: repository.name,

        fullName: repository.fullName,

        owner: repository.owner,

        description: repository.description,

        language: repository.language,

        defaultBranch: repository.defaultBranch,

        visibility: repository.visibility,

        private: repository.private,

        cloneUrl: repository.cloneUrl,

        htmlUrl: repository.htmlUrl,

        importedBy: userId,
    });
};


export const getProjectRepositoriesService = async (
    projectId
) => {

    return await Repository.find({
        project: projectId,
    }).sort({
        createdAt: -1,
    });
};


export const getRepositoryTreeForProjectService = async (
    repositoryId,
    userId
) => {

    // Find ForgeAI repository
    const repository = await Repository.findById(
        repositoryId
    );

    if (!repository) {
        throw new Error(
            "Repository not found."
        );
    }

    // Find connected GitHub account
    const githubAccount =
        await GithubAccount.findOne({
            user: userId,
        });

    if (!githubAccount) {
        throw new Error(
            "GitHub account not connected."
        );
    }

    // Fetch repository tree from GitHub
    const tree =
        await getRepositoryTreeService(
            githubAccount.accessToken,
            repository.owner,
            repository.name,
            repository.defaultBranch
        );

    return {
        repository: {
            _id: repository._id,
            name: repository.name,
            fullName: repository.fullName,
            owner: repository.owner,
            defaultBranch: repository.defaultBranch,
        },
        tree,
    };
};

export const getRepositoryByIdService = async (
    repositoryId
) => {

    const repository =
        await Repository.findById(
            repositoryId
        );

    if (!repository) {
        throw new Error(
            "Repository not found."
        );
    }

    return repository;
};