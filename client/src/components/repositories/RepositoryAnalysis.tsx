"use client";

import { useState } from "react";

import { analyzeRepository } from "@/services/github.service";

interface RepositoryAnalysisData {
    languages: string[];
    framework: string | null;
    packageManager: string | null;
    hasFrontend: boolean;
    hasBackend: boolean;
    hasDocker: boolean;
    hasReadme: boolean;
    defaultBranch: string;
    totalFiles: number;
    totalDirectories: number;
}

interface RepositoryAnalysisProps {
    repositoryId: string;
}

export default function RepositoryAnalysis({
    repositoryId,
}: RepositoryAnalysisProps) {

    const [analysis, setAnalysis] =
        useState<RepositoryAnalysisData | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);


    const handleAnalyze = async () => {

        try {

            setLoading(true);

            setError(null);

            const response =
                await analyzeRepository(
                    repositoryId
                );

            setAnalysis(
                response.analysis
            );

        } catch (error) {

            console.error(
                "Repository analysis failed:",
                error
            );

            setError(
                "Failed to analyze repository."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold">
                        Repository Analysis
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Analyze the repository structure
                        and technology stack.
                    </p>

                </div>


                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
                >

                    {loading
                        ? "Analyzing..."
                        : "Analyze Repository"}

                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="mt-4 rounded-md border border-red-800 bg-red-950 p-3 text-sm text-red-400">

                    {error}

                </div>

            )}


            {/* Analysis */}

            {analysis && (

                <div className="mt-6 space-y-6">

                    {/* Statistics */}

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                        <div className="rounded-md border border-gray-800 p-4">

                            <p className="text-sm text-gray-500">
                                Files
                            </p>

                            <p className="mt-1 text-2xl font-semibold">
                                {analysis.totalFiles}
                            </p>

                        </div>


                        <div className="rounded-md border border-gray-800 p-4">

                            <p className="text-sm text-gray-500">
                                Directories
                            </p>

                            <p className="mt-1 text-2xl font-semibold">
                                {analysis.totalDirectories}
                            </p>

                        </div>


                        <div className="rounded-md border border-gray-800 p-4">

                            <p className="text-sm text-gray-500">
                                Framework
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                                {analysis.framework || "Unknown"}
                            </p>

                        </div>


                        <div className="rounded-md border border-gray-800 p-4">

                            <p className="text-sm text-gray-500">
                                Package Manager
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                                {analysis.packageManager || "Unknown"}
                            </p>

                        </div>

                    </div>


                    {/* Languages */}

                    <div>

                        <h3 className="text-sm font-medium text-gray-400">
                            Languages
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">

                            {analysis.languages.length > 0 ? (

                                analysis.languages.map(
                                    (language) => (

                                        <span
                                            key={language}
                                            className="rounded-md bg-gray-800 px-3 py-1 text-sm"
                                        >
                                            {language}
                                        </span>

                                    )
                                )

                            ) : (

                                <span className="text-sm text-gray-500">
                                    No languages detected.
                                </span>

                            )}

                        </div>

                    </div>


                    {/* Features */}

                    <div>

                        <h3 className="text-sm font-medium text-gray-400">
                            Repository Features
                        </h3>

                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">

                            <Feature
                                label="Frontend"
                                enabled={
                                    analysis.hasFrontend
                                }
                            />

                            <Feature
                                label="Backend"
                                enabled={
                                    analysis.hasBackend
                                }
                            />

                            <Feature
                                label="Docker"
                                enabled={
                                    analysis.hasDocker
                                }
                            />

                            <Feature
                                label="README"
                                enabled={
                                    analysis.hasReadme
                                }
                            />

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


function Feature({
    label,
    enabled,
}: {
    label: string;
    enabled: boolean;
}) {

    return (

        <div className="rounded-md border border-gray-800 p-3">

            <span className="text-sm">

                {enabled
                    ? "✓"
                    : "✗"}

                {" "}

                {label}

            </span>

        </div>

    );

}