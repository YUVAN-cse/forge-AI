
import {
    reviewRepositoryFile,
} from "../services/repositoryCodeReview.service.js";

export const reviewRepositoryCode = async (req, res) => {
    try {
        const { repositoryId } = req.params;
        const { filePath } = req.body;

        if (
            typeof filePath !== "string" ||
            !filePath.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "File path is required.",
            });
        }

        const result = await reviewRepositoryFile({
            repositoryId,
            userId: req.user._id,
            filePath: filePath.trim(),
        });

        return res.status(200).json({
            success: true,
            result,
        });

    } catch (error) {
        console.error(
            "Repository Code Review Error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.statusCode && error.statusCode < 500
                    ? error.message
                    : "Failed to review repository code.",
        });
    }
};
