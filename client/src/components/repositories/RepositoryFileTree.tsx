"use client";

import { useState } from "react";

interface RepositoryTreeItem {
    path: string;
    mode: string;
    type: "tree" | "blob";
    sha: string;
    url: string;
}

interface TreeNode {
    name: string;
    path: string;
    type: "tree" | "blob";
    children: TreeNode[];
}

interface RepositoryFileTreeProps {
    tree: RepositoryTreeItem[];
    onFileClick: (path: string) => void;
}

const buildTree = (
    items: RepositoryTreeItem[]
): TreeNode[] => {

    const root: TreeNode[] = [];

    for (const item of items) {

        const parts = item.path.split("/");

        let currentLevel = root;

        parts.forEach((part, index) => {

            const currentPath =
                parts.slice(0, index + 1).join("/");

            const isLast =
                index === parts.length - 1;

            let existingNode =
                currentLevel.find(
                    (node) =>
                        node.name === part
                );

            if (!existingNode) {

                existingNode = {
                    name: part,
                    path: currentPath,
                    type: isLast
                        ? item.type
                        : "tree",
                    children: [],
                };

                currentLevel.push(
                    existingNode
                );
            }

            currentLevel =
                existingNode.children;

        });

    }

    return root;
};


interface TreeNodeItemProps {
    node: TreeNode;
    level: number;
    onFileClick: (path: string) => void;
}

function TreeNodeItem({
    node,
    level,
    onFileClick,
}: TreeNodeItemProps) {

    const [expanded, setExpanded] =
        useState(false);

    const isFolder =
        node.type === "tree";

    const handleClick = () => {

        if (isFolder) {

            setExpanded(!expanded);

        } else {

            onFileClick(node.path);

        }

    };

    return (
        <div>

            {/* Current Node */}

            <div
                onClick={handleClick}
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-gray-800"
                style={{
                    paddingLeft: `${level * 20 + 12}px`,
                }}
            >

                {/* Folder Expand Icon */}

                {isFolder ? (

                    <span className="w-4 text-xs text-gray-500">
                        {expanded ? "▼" : "▶"}
                    </span>

                ) : (

                    <span className="w-4" />

                )}

                {/* File / Folder Icon */}

                <span>
                    {isFolder
                        ? (expanded ? "📂" : "📁")
                        : "📄"}
                </span>

                {/* Name */}

                <span className="truncate">
                    {node.name}
                </span>

            </div>

            {/* Children */}

            {isFolder &&
                expanded &&
                node.children.length > 0 && (

                    <div>

                        {node.children.map(
                            (child) => (

                                <TreeNodeItem
                                    key={child.path}
                                    node={child}
                                    level={level + 1}
                                    onFileClick={onFileClick}
                                />

                            )
                        )}

                    </div>

                )}

        </div>
    );
}
export default function RepositoryFileTree({
    tree,
    onFileClick,
}: RepositoryFileTreeProps) {

    const treeStructure =
        buildTree(tree);

    return (

        <div className="divide-y divide-gray-800">

            {treeStructure.length === 0 ? (

                <div className="p-6 text-center text-gray-500">
                    No files found.
                </div>

            ) : (

                treeStructure.map(
                    (node) => (

                        <TreeNodeItem
                            key={node.path}
                            node={node}
                            level={0}
                            onFileClick={onFileClick}
                        />

                    )
                )

            )}

        </div>
    );
}