import axios from "axios";
import GithubAccount from "../models/githubAccount.model.js";

export const githubCallbackService = async ({ code, state }) => {

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
        { user: state },
        {
            user: state,
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

export const getRepositoriesService = async (userId) => {

    // Find the connected GitHub account
    const githubAccount = await GithubAccount.findOne({ user: userId });

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