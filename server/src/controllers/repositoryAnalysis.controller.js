import {
    analyzeRepositoryService,
} from "../services/repositoryAnalysis.service.js";


export const analyzeRepository = async (
    req,
    res
) => {

    try {

        const {
            repositoryId,
        } = req.params;


        const analysis =
            await analyzeRepositoryService(
                repositoryId,
                req.user._id
            );


        return res.status(200).json({

            success: true,

            message:
                "Repository analyzed successfully.",

            analysis,

        });


    } catch (error) {

        console.error(
            "Repository analysis error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};