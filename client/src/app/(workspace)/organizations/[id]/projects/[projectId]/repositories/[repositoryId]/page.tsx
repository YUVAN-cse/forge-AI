"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import RepositoryFileTree from "@/components/repositories/RepositoryFileTree";
import CodeViewer from "@/components/repositories/CodeViewer";
import RepositoryAnalysis from "@/components/repositories/RepositoryAnalysis";

import { getRepositoryTree } from "@/services/github.service";
import { getRepositoryFile } from "@/services/repository.service";

interface RepositoryTreeItem {
    path: string;
    mode: string;
    type: "tree" | "blob";
    sha: string;
    url: string;
}

interface RepositoryFile {
    name: string;
    path: string;
    content: string;
}

export default function RepositoryExplorerPage() {

    const params = useParams();

    const repositoryId =
        params.repositoryId as string;

    const [tree, setTree] =
        useState<RepositoryTreeItem[]>([]);

    const [selectedFile, setSelectedFile] =
        useState<RepositoryFile | null>(null);

    const [loadingTree, setLoadingTree] =
        useState(true);

    const [loadingFile, setLoadingFile] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);


    // ==========================================
    // LOAD REPOSITORY TREE
    // ==========================================

    useEffect(() => {

        const loadTree = async () => {

            try {

                setLoadingTree(true);
                setError(null);

                const response =
                    await getRepositoryTree(
                        repositoryId
                    );

                setTree(
                    response.tree || []
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

                setLoadingTree(false);

            }

        };

        if (repositoryId) {
            loadTree();
        }

    }, [repositoryId]);


    // ==========================================
    // LOAD FILE
    // ==========================================

    const handleFileClick = async (
        path: string
    ) => {

        try {

            setLoadingFile(true);
            setError(null);

            const response =
                await getRepositoryFile(
                    repositoryId,
                    path
                );

            setSelectedFile(
                response.file || response
            );

        } catch (error) {

            console.error(
                "Failed to load repository file:",
                error
            );

            setError(
                "Failed to load file."
            );

        } finally {

            setLoadingFile(false);

        }

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="space-y-6 p-6">

            {/* ==================================
                REPOSITORY ANALYSIS
            ================================== */}

            <RepositoryAnalysis
                repositoryId={repositoryId}
            />


            {/* ==================================
                REPOSITORY EXPLORER
            ================================== */}

            <div className="grid h-[calc(100vh-400px)] grid-cols-4 gap-6">


                {/* ==================================
                    FILE TREE
                ================================== */}

                <div className="col-span-1 overflow-auto rounded-lg border border-gray-800">

                    {loadingTree ? (

                        <div className="p-6 text-center text-gray-500">
                            Loading repository...
                        </div>

                    ) : (

                        <RepositoryFileTree
                            tree={tree}
                            onFileClick={handleFileClick}
                        />

                    )}

                </div>


                {/* ==================================
                    CODE VIEWER
                ================================== */}

                <div className="col-span-3 overflow-hidden">

                    {error ? (

                        <div className="flex h-full items-center justify-center rounded-lg border border-gray-800 text-red-500">

                            {error}

                        </div>

                    ) : loadingFile ? (

                        <div className="flex h-full items-center justify-center rounded-lg border border-gray-800 text-gray-500">

                            Loading file...

                        </div>

                    ) : selectedFile ? (

                        <CodeViewer
                            fileName={
                                selectedFile.name
                            }
                            filePath={
                                selectedFile.path
                            }
                            content={
                                selectedFile.content
                            }
                        />

                    ) : (

                        <div className="flex h-full items-center justify-center rounded-lg border border-gray-800 text-gray-500">

                            Select a file to view.

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}