"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RepositoryFileTree from "@/components/repositories/RepositoryFileTree";
import api from "@/lib/axios";

interface RepositoryInfo {
    _id: string;
    name: string;
    fullName: string;
    owner: string;
    defaultBranch: string;
}

interface RepositoryTreeItem {
    path: string;
    mode: string;
    type: "tree" | "blob";
    sha: string;
    url: string;
}

interface RepositoryTreeResponse {
    success: boolean;
    repository: RepositoryInfo;
    tree: RepositoryTreeItem[];
}

export default function RepositoryExplorerPage() {

    const params = useParams();
    const router = useRouter();

    const organizationId = params.id as string;
    const projectId = params.projectId as string;
    const repositoryId = params.repositoryId as string;

    const [repository, setRepository] =
        useState<RepositoryInfo | null>(null);

    const [tree, setTree] =
        useState<RepositoryTreeItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);


    useEffect(() => {

        const fetchRepositoryTree = async () => {

            try {

                setLoading(true);
                setError(null);

                const response =
                    await api.get<RepositoryTreeResponse>(
                        `/repositories/${repositoryId}/tree`
                    );

                setRepository(
                    response.data.repository
                );

                setTree(
                    response.data.tree || []
                );

            } catch (error) {

                console.error(
                    "Failed to load repository tree:",
                    error
                );

                setError(
                    "Failed to load repository."
                );

            } finally {

                setLoading(false);

            }

        };

        if (repositoryId) {
            fetchRepositoryTree();
        }

    }, [repositoryId]);


    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading repository...
                </p>

            </div>
        );

    }


    if (error) {

        return (
            <div className="p-6">

                <button
                    onClick={() => router.back()}
                    className="mb-6 text-sm text-gray-500 hover:text-white"
                >
                    ← Back
                </button>

                <div className="rounded-lg border border-red-900 bg-red-950/30 p-6 text-red-400">
                    {error}
                </div>

            </div>
        );

    }


    return (

        <div className="p-6">

            {/* Back Button */}

            <button
                onClick={() => router.back()}
                className="mb-6 text-sm text-gray-500 hover:text-white"
            >
                ← Back to Repositories
            </button>


            {/* Repository Header */}

            <div className="mb-8">

                <h1 className="text-2xl font-bold">
                    {repository?.name}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    {repository?.fullName}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                    Branch:{" "}
                    <span className="text-gray-300">
                        {repository?.defaultBranch}
                    </span>
                </p>

            </div>


            {/* Repository Tree */}

            <div className="rounded-lg border border-gray-800 bg-gray-900">

                <div className="border-b border-gray-800 px-5 py-4">

                    <h2 className="font-semibold">
                        Repository Files
                    </h2>

                </div>


                <RepositoryFileTree
                    tree={tree}
                />

            </div>

        </div>

    );

}