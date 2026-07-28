import jwt from "jsonwebtoken";
import {
    githubCallbackService,
    getRepositoriesService,
} from "../services/github.service.js";

export const connectGithub = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        // Create signed OAuth state token
        const state = jwt.sign(
            {
                userId,
                purpose: "github_oauth",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m",
            }
        );

        const githubURL =
            `https://github.com/login/oauth/authorize` +
            `?client_id=${process.env.GITHUB_CLIENT_ID}` +
            `&scope=repo,user` +
            `&state=${encodeURIComponent(state)}`;

        return res.redirect(githubURL);

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};


export const githubCallback = async (req, res) => {
    try {

        const result = await githubCallbackService(req.query);

        return res.status(200).json(result);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: "error",
            message: error.message,
        });

    }
};

export const getRepositories = async (req, res) => {
    try {

        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required.",
            });
        }

        const repositories = await getRepositoriesService(
            req.user._id,
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
