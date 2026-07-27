import axios from "axios";
import GithubAccount from "../models/githubAccount.model.js";
import { githubCallbackService } from "../services/github.service.js";
import { getRepositoriesService } from "../services/github.service.js";

export const connectGithub = async (req, res) => {
    try {
        // Current logged-in ForgeAI user
        const userId = req.user._id;

        // GitHub OAuth URL
        const githubURL =
            `https://github.com/login/oauth/authorize` +
            `?client_id=${process.env.GITHUB_CLIENT_ID}` +
            `&scope=repo,user` +
            `&state=${userId}`;

        // Redirect user to GitHub
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

        const repositories = await getRepositoriesService(req.user._id);

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
