import jwt from "jsonwebtoken";
import {
    githubCallbackService,
    getRepositoriesService,
    getRepositoryTreeService
} from "../services/github.service.js";

import Project from "../models/project.model.js";
import Organization from "../models/organization.model.js";
import Repository from "../models/repository.model.js";


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


export const getRepositoryTree = async (req, res) => {
    try {

        const { repositoryId } = req.params;

        // 1. Find repository
        const repository = await Repository.findById(
            repositoryId
        );

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found.",
            });
        }

        // 2. Find project
        const project = await Project.findById(
            repository.project
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        // 3. Find organization
        const organization = await Organization.findById(
            project.organization
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found.",
            });
        }

        // 4. Verify user is organization member
        const userIsMember = organization.members.some(
            (member) =>
                member.toString() === req.user.id.toString()
        );

        if (!userIsMember) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not a member of this organization.",
            });
        }

        // 5. Find connected GitHub account
        const githubAccount =
            await GithubAccount.findOne({
                user: req.user._id,
            });

        if (!githubAccount) {
            return res.status(400).json({
                success: false,
                message:
                    "GitHub account is not connected.",
            });
        }

        // 6. Fetch repository tree from GitHub
        const tree =
            await getRepositoryTreeService(
                githubAccount.accessToken,
                repository.owner,
                repository.name,
                repository.defaultBranch
            );

        // 7. Return repository tree
        return res.status(200).json({
            success: true,
            repository: {
                id: repository._id,
                name: repository.name,
                fullName: repository.fullName,
                owner: repository.owner,
                defaultBranch:
                    repository.defaultBranch,
            },
            tree,
        });

    } catch (error) {

        console.error(
            "GET REPOSITORY TREE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};