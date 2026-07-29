import {
    importRepositoryService,
    getProjectRepositoriesService,
    getRepositoryTreeForProjectService,
} from "../services/repository.service.js";

export const importRepository = async (req, res) => {
    try {

        const { projectId } = req.params;

        const repository = req.body;

        const importedRepository = await importRepositoryService(
            projectId,
            repository,
            req.user._id
        );

        return res.status(201).json({
            success: true,
            message: "Repository imported successfully.",
            repository: importedRepository,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


export const getProjectRepositories = async (
    req,
    res
) => {

    try {

        const { projectId } = req.params;

        const repositories =
            await getProjectRepositoriesService(
                projectId
            );

        return res.status(200).json({
            success: true,
            repositories,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


export const getRepositoryTree = async (
    req,
    res
) => {

    try {

        const { repositoryId } = req.params;

        const result =
            await getRepositoryTreeForProjectService(
                repositoryId,
                req.user._id
            );

        return res.status(200).json({
            success: true,
            ...result,
        });

    } catch (error) {

        console.error(
            "Repository tree error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};