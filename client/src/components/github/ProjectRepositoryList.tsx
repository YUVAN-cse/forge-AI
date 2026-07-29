"use client";

import { useEffect, useState } from "react";
import { getProjectRepositories } from "@/services/github.service";
import { useRouter } from "next/navigation";

interface ProjectRepository {
    _id: string;
    githubRepoId: number;
    name: string;
    fullName: string;
    owner: string;
    description?: string;
    language?: string;
    defaultBranch: string;
    private: boolean;
    htmlUrl: string;
}

interface ProjectRepositoryListProps {
    organizationId: string;
    projectId: string;
}

export default function ProjectRepositoryList({
    organizationId,
    projectId,
}: ProjectRepositoryListProps) {

    const router = useRouter();

    const [repositories, setRepositories] =
        useState<ProjectRepository[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);


    useEffect(() => {

        const fetchRepositories = async () => {

            try {

                setLoading(true);

                const data =
                    await getProjectRepositories(
                        projectId
                    );

                setRepositories(
                    data.repositories || []
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load connected repositories."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchRepositories();

    }, [projectId]);


    if (loading) {

        return (
            <div className="py-10 text-center">
                Loading connected repositories...
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
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center text-gray-500">
                No repositories connected to this project yet.
            </div>
        );

    }


    return (

        <div className="mt-6 grid gap-4 md:grid-cols-2">

            {repositories.map((repository) => (

                <div
                    key={repository._id}
                    className="rounded-lg border border-gray-800 bg-gray-900 p-6 wrap-break-words"
                >

                    <div className="flex items-start justify-between wrap-break-words">

                        <div>

                            <h3 className="text-lg font-semibold wrap-break-words">
                                {repository.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {repository.fullName}
                            </p>

                        </div>

                        <span className="text-sm text-green-500">
                            Connected
                        </span>

                    </div>


                    <p className="mt-4 text-sm text-gray-400">
                        {repository.description ||
                            "No description available"}
                    </p>


                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">

                        {repository.language && (
                            <span>
                                {repository.language}
                            </span>
                        )}

                        <span>
                            {repository.private
                                ? "Private"
                                : "Public"}
                        </span>

                    </div>


                    <div className="mt-5 flex gap-3">

                        <a
                            href={repository.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md border border-gray-700 px-4 py-2 text-sm"
                        >
                            GitHub
                        </a>

                        <button
                            className="rounded-md bg-white px-4 py-2 text-sm text-black"
                            onClick={() => {
                                router.push(
                                    `/organizations/${organizationId}/projects/${projectId}/repositories/${repository._id}`
                                );
                            }}
                        >
                            Explore Repository
                        </button>

                    </div>

                </div>

            ))}

        </div>

    );

}