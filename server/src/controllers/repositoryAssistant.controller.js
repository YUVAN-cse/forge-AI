
import {
    askRepositoryAssistant,
} from "../services/repositoryAssistant.service.js";

export const askRepositoryQuestion = async (req, res) => {
    try {
        const { repositoryId } = req.params;
        const { question } = req.body;

        if (
            typeof question !== "string" ||
            !question.trim() ||
            question.trim().length > 2000
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Question must contain between 1 and 2000 characters.",
            });
        }

        const result = await askRepositoryAssistant({
            repositoryId,
            userId: req.user._id,
            question: question.trim(),
        });

        return res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        console.error(
            "Repository Assistant Error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.statusCode && error.statusCode < 500
                    ? error.message
                    : "Failed to generate repository answer.",
        });
    }
};
