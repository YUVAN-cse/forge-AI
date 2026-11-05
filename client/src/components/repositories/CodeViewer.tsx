
"use client";

import { useEffect, useRef } from "react";

interface CodeViewerProps {
    fileName: string;
    filePath: string;
    content: string;
    selectedLine?: number | null;
}

export default function CodeViewer({
    fileName,
    filePath,
    content,
    selectedLine = null,
}: CodeViewerProps) {

    const codeContainerRef = useRef<HTMLDivElement>(null);

    const lines = content.split("\n");

    useEffect(() => {
        if (!selectedLine) return;

        const selectedElement =
            codeContainerRef.current?.querySelector(
                `[data-line="${selectedLine}"]`
            );

        selectedElement?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

    }, [selectedLine]);

    return (
        <div className="flex h-full flex-col rounded-lg border border-gray-800 bg-gray-900">

            {/* Header */}
            <div className="border-b border-gray-800 px-4 py-3">
                <h2 className="text-lg font-semibold">
                    {fileName}
                </h2>

                <p className="text-sm text-gray-500">
                    {filePath}
                </p>
            </div>

            {/* Code */}
            <div
                ref={codeContainerRef}
                className="flex-1 overflow-auto"
            >
                <pre className="min-h-full py-4 text-sm">
                    <code>
                        {lines.map((line, index) => {
                            const lineNumber = index + 1;
                            const isSelected = selectedLine === lineNumber;

                            return (
                                <div
                                    key={lineNumber}
                                    data-line={lineNumber}
                                    className={`flex min-w-max px-4 ${
                                        isSelected
                                            ? "bg-yellow-500/20 border-l-2 border-yellow-400"
                                            : "border-l-2 border-transparent"
                                    }`}
                                >
                                    <span className="w-12 shrink-0 select-none text-right pr-4 text-gray-600">
                                        {lineNumber}
                                    </span>

                                    <span className="whitespace-pre text-gray-200">
                                        {line || " "}
                                    </span>
                                </div>
                            );
                        })}
                    </code>
                </pre>
            </div>

        </div>
    );
}
