import jwt from "jsonwebtoken";
import {
    githubCallbackService,
    getRepositoriesService,
} from "../services/github.service.js";

import GithubAccount from "../models/githubAccount.model.js";

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

        await githubCallbackService(req.query);

        return res.redirect(
            "http://localhost:3000/github?connected=true"
        );

    } catch (error) {

        console.log(error);

        return res.redirect(
            `http://localhost:3000/github?connected=false&error=${encodeURIComponent(
                error.message
            )}`
        );

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


export const getGithubAccount = async (req, res) => {
    try {

        const githubAccount = await GithubAccount.findOne({
            user: req.user._id,
        }).select(
            "githubId username displayName avatarUrl profileUrl connectedAt"
        );

        if (!githubAccount) {
            return res.status(200).json({
                success: true,
                connected: false,
            });
        }

        return res.status(200).json({
            success: true,
            connected: true,
            account: githubAccount,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};