
"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

import { generateRepositoryUML } from "@/services/repository.service";

interface RepositoryUMLProps {
    repositoryId: string;
}

type DiagramType = "class" | "sequence" | "component";

mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "strict",
});

export default function RepositoryUML({
    repositoryId,
}: RepositoryUMLProps) {

    const [diagramType, setDiagramType] =
        useState<DiagramType>("class");

    const [diagram, setDiagram] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const diagramRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        try {
            setLoading(true);
            setError(null);
            setDiagram("");

            const result = await generateRepositoryUML(
                repositoryId,
                diagramType
            );

            setDiagram(result.mermaid);

        } catch (error) {
            console.error("UML generation failed:", error);
            setError("Failed to generate UML diagram.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const renderDiagram = async () => {
            if (!diagram || !diagramRef.current) return;

            try {
                const id = `uml-${Date.now()}`;

                const { svg } = await mermaid.render(
                    id,
                    diagram
                );

                if (diagramRef.current) {
                    diagramRef.current.innerHTML = svg;
                }

            } catch (error) {
                console.error("Mermaid rendering failed:", error);
                setError("Failed to render UML diagram.");
            }
        };

        renderDiagram();
    }, [diagram]);

    return (
        <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-950 p-6">

            <div>
                <h2 className="text-xl font-semibold text-white">
                    UML Generator
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                    Generate AI-powered architecture diagrams from your repository.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">

                <select
                    value={diagramType}
                    onChange={(e) =>
                        setDiagramType(
                            e.target.value as DiagramType
                        )
                    }
                    className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white"
                >
                    <option value="class">Class Diagram</option>
                    <option value="sequence">Sequence Diagram</option>
                    <option value="component">Component Diagram</option>
                </select>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Generating..." : "Generate UML"}
                </button>

            </div>

            {error && (
                <div className="rounded-lg border border-red-800 bg-red-950/30 p-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {loading && (
                <div className="py-10 text-center text-gray-400">
                    Analyzing repository and generating diagram...
                </div>
            )}

            {diagram && (
                <div className="overflow-auto rounded-lg border border-gray-800 bg-gray-900 p-5">
                    <div
                        ref={diagramRef}
                        className="flex min-h-50 justify-center"
                    />
                </div>
            )}

        </div>
    );
}
