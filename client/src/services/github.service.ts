import axios from "axios";
import { GithubRepository } from "@/types/github";
import api from "@/lib/axios";

const GITHUB_API_URL = "http://localhost:5000/api/github";
const REPOSITORY_API_URL = "http://localhost:5000/api/repositories";

export const connectGithub = () => {
    window.location.href = `${GITHUB_API_URL}/connect`;
};

export const getGithubRepositories = async (
    projectId: string
) => {
    const response = await axios.get(
        `${GITHUB_API_URL}/repositories`,
        {
            params: {
                projectId,
            },
            withCredentials: true,
        }
    );

    return response.data;
};

export const importGithubRepository = async (
    projectId: string,
    repository: GithubRepository
) => {
    const response = await axios.post(
        `${REPOSITORY_API_URL}/projects/${projectId}/import`,
        {
            githubRepoId: repository.githubRepoId,
            name: repository.name,
            fullName: repository.fullName,
            owner: repository.owner,
            description: repository.description,
            private: repository.private,
            visibility: repository.visibility,
            language: repository.language,
            defaultBranch: repository.defaultBranch,
            stars: repository.stars,
            forks: repository.forks,
            openIssues: repository.openIssues,
            size: repository.size,
            cloneUrl: repository.cloneUrl,
            htmlUrl: repository.htmlUrl,
            createdAt: repository.createdAt,
            updatedAt: repository.updatedAt,
        },
        {
            withCredentials: true,
        }
    );

    return response.data;
};


export const getGithubAccount = async () => {

    const response = await api.get(
        "/github/account"
    );

    return response.data;
};

export const getProjectRepositories = async (
    projectId: string
) => {

    const response = await api.get(
        `/repositories/project/${projectId}`
    );

    return response.data;
};