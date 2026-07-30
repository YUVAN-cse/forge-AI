"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import RepositoryFileTree from "@/components/repositories/RepositoryFileTree";
import CodeViewer from "@/components/repositories/CodeViewer";

import { getRepositoryTree } from "@/services/github.service";
import { getRepositoryFile } from "@/services/repository.service";

export default function RepositoryExplorerPage() {

    const params = useParams();

    const repositoryId =
        params.repositoryId as string;

    const [tree, setTree] = useState([]);

    const [selectedFile, setSelectedFile] =
        useState<any>(null);

    useEffect(() => {

        const loadTree = async () => {

            const response =
                await getRepositoryTree(
                    repositoryId
                );

            setTree(response.tree);

        };

        loadTree();

    }, [repositoryId]);

    const handleFileClick = async (
        path: string
    ) => {

        const file =
            await getRepositoryFile(
                repositoryId,
                path
            );

        setSelectedFile(file);

    };

    return (

        <div className="grid grid-cols-4 gap-6 p-6 h-[calc(100vh-120px)]">

            <div className="col-span-1 overflow-auto rounded-lg border border-gray-800">

                <RepositoryFileTree
                    tree={tree}
                    onFileClick={handleFileClick}
                />

            </div>

            <div className="col-span-3 overflow-hidden">

                {selectedFile ? (

                    <CodeViewer
                        fileName={selectedFile.name}
                        filePath={selectedFile.path}
                        content={selectedFile.content}
                    />

                ) : (

                    <div className="flex h-full items-center justify-center rounded-lg border border-gray-800 text-gray-500">

                        Select a file to view.

                    </div>

                )}

            </div>

        </div>

    );

}