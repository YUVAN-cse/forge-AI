
import {
    getRepositoryTreeForProjectService
} from "../services/repository.service.js";

import {
    buildCodebaseUnderstanding
} from "../services/codebaseUnderstanding.service.js";

import {
    generateRepositoryUML,
} from "../services/uml.service.js";

export const getRepositoryIntelligence = async (req, res) => {
    try {
        const { repositoryId } = req.params;

        const result =
            await getRepositoryTreeForProjectService(
                repositoryId,
                req.user._id
            );

        const understanding =
            await buildCodebaseUnderstanding(
                result.tree,
                repositoryId,
                req.user._id
            );

        return res.status(200).json({
            success: true,
            understanding,
        });
    } catch (error) {
        console.error(
            "Repository intelligence error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const generateRepositoryUMLController = async (req, res) => {
    try {
        const { repositoryId } = req.params;
        const { diagramType } = req.body;

        const result =
            await getRepositoryTreeForProjectService(
                repositoryId,
                req.user._id
            );

        const uml =
            await generateRepositoryUML({
                tree: result.tree,
                repositoryId,
                userId: req.user._id,
                diagramType,
            });

        return res.status(200).json({
            success: true,
            uml,
        });

    } catch (error) {
        console.error("UML generation error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};