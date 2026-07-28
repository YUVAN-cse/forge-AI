import axios from "axios";
import GithubAccount from "../models/githubAccount.model.js";
import jwt from "jsonwebtoken";

export const githubCallbackService = async ({ code, state }) => {

    // Validate OAuth state
    let decodedState;

    try {
        decodedState = jwt.verify(
            state,
            process.env.JWT_SECRET
        );
    } catch (error) {
        throw new Error("Invalid or expired GitHub OAuth state.");
    }

    if (decodedState.purpose !== "github_oauth") {
        throw new Error("Invalid GitHub OAuth state.");
    }

    const userId = decodedState.userId;

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        },
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch GitHub user profile
    const profileResponse = await axios.get(
        "https://api.github.com/user",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const profile = profileResponse.data;

    // Save or update GitHub account
    await GithubAccount.findOneAndUpdate(
    { user: userId },
    {
        user: userId,
            githubId: profile.id,
            username: profile.login,
            displayName: profile.name,
            avatarUrl: profile.avatar_url,
            profileUrl: profile.html_url,
            accessToken,
            connectedAt: new Date(),
        },
        {
            upsert: true,
            new: true,
        }
    );

    return {
        success: true,
        message: "GitHub account connected successfully",
    };
};

export const getRepositoriesService = async (userId, projectId) => {

    // Find the connected GitHub account
    const githubAccount = await GithubAccount.findOne({
        user: userId
    });

    if (!githubAccount) {
        throw new Error("GitHub account not connected.");
    }

    // Fetch repositories from GitHub
    const response = await axios.get(
        "https://api.github.com/user/repos",
        {
            headers: {
                Authorization: `Bearer ${githubAccount.accessToken}`,
            },
        }
    );

    // Import Repository model
    const Repository = (
        await import("../models/repository.model.js")
    ).default;

    // Find repositories already imported into this project
    const importedRepositories = await Repository.find({
        project: projectId,
    }).select("githubRepoId");

    // Create a Set for faster lookup
    const importedRepoIds = new Set(
        importedRepositories.map(
            (repo) => repo.githubRepoId
        )
    );

    return response.data.map((repo) => ({
        githubRepoId: repo.id,

        name: repo.name,

        fullName: repo.full_name,

        owner: repo.owner.login,

        description: repo.description,

        private: repo.private,

        visibility: repo.visibility,

        language: repo.language,

        defaultBranch: repo.default_branch,

        stars: repo.stargazers_count,

        forks: repo.forks_count,

        openIssues: repo.open_issues_count,

        size: repo.size,

        cloneUrl: repo.clone_url,

        htmlUrl: repo.html_url,

        createdAt: repo.created_at,

        updatedAt: repo.updated_at,

        // Check if already imported
        alreadyImported: importedRepoIds.has(repo.id),
    }));
};

export const getRepositoryTreeService = async (
    accessToken,
    owner,
    repo,
    branch = "main"
) => {

    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data.tree;
};