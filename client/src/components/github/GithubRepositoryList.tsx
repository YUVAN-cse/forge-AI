"use client";

import { useEffect, useState } from "react";
import {
    getGithubRepositories,
} from "@/services/github.service";

import {
    GithubRepository,
} from "@/types/github";

import GithubRepositoryCard from "./GithubRepositoryCard";

interface GithubRepositoryListProps {
    projectId: string;
}

export default function GithubRepositoryList({
    projectId,
}: GithubRepositoryListProps) {

    const [repositories, setRepositories] =
        useState<GithubRepository[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);


    useEffect(() => {

        const fetchRepositories = async () => {

            try {

                setLoading(true);

                const data = await getGithubRepositories(projectId); 

                setRepositories(
                    data.repositories || []
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load GitHub repositories."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchRepositories();

    }, []);


    if (loading) {

        return (
            <div className="py-10 text-center">
                Loading GitHub repositories...
            </div>
        );

    }


    if (error) {

        return (
            <div className="py-10 text-center text-red-500">
                {error}
            </div>
        );

    }


    if (repositories.length === 0) {

        return (
            <div className="py-10 text-center text-gray-500">
                No GitHub repositories found.
            </div>
        );

    }


    return (

        <div className="mt-6 max-h-150 overflow-y-auto pr-2 overflow-x-hidden">
    <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-2">
        {repositories.map((repository) => (
            <GithubRepositoryCard
                key={repository.githubRepoId}
                repository={repository}
                projectId={projectId}
            />
        ))}
    </div>
</div>

    );
}