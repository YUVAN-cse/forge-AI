import { importRepositoryService } from "../services/repository.service.js";

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