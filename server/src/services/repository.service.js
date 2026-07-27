import Repository from "../models/repository.model.js";

export const importRepositoryService = async (
    projectId,
    repository,
    userId
) => {

    const existingRepository = await Repository.findOne({
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