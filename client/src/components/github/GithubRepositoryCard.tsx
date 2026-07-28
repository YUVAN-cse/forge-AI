"use client";

import { GithubRepository } from "@/types/github";
import { importGithubRepository } from "@/services/github.service";
import { useState } from "react";

interface GithubRepositoryCardProps {
    repository: GithubRepository;
    projectId: string;
}

export default function GithubRepositoryCard({
    repository,
    projectId,
}: GithubRepositoryCardProps) {

    const [loading, setLoading] = useState(false);

    const handleImport = async () => {

    try {

        setLoading(true);

        await importGithubRepository(
            projectId,
            repository
        );

        // Optional: refresh later
        window.location.reload();

    } catch (error) {

        console.error(
            "Failed to import repository:",
            error
        );

    } finally {

        setLoading(false);

    }
};

    return (
       <div className="flex h-full flex-col rounded-lg border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-600 hover:bg-gray-800">

    {/* Header */}
    <div className="flex items-start justify-between gap-4">

        <div className="min-w-0 flex-1">

            <h3 className="wrap-break-word text-lg font-semibold">
                {repository.name}
            </h3>

            <p className="mt-1 wrap-break-word text-sm text-gray-500">
                {repository.description ||
                    "No description available"}
            </p>

        </div>

        <span className="shrink-0 text-sm text-gray-500">
            {repository.private
                ? "Private"
                : "Public"}
        </span>

    </div>


    {/* Repository Info */}
    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">

        {repository.language && (
            <span>
                {repository.language}
            </span>
        )}

        <a
            href={repository.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
        >
            View on GitHub
        </a>

    </div>


    {/* Button */}
    <div className="mt-auto pt-5">

        {repository.alreadyImported ? (

            <button
                disabled
                className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-400"
            >
                Imported ✓
            </button>

        ) : (

            <button
                onClick={handleImport}
                disabled={loading}
                className="rounded-md bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
            >
                {loading
                    ? "Importing..."
                    : "Import Repository"}
            </button>

        )}

    </div>

</div>
    );
}