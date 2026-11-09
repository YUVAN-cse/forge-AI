
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


    
const handleExportSVG = () => {
    const svg = diagramRef.current?.querySelector("svg");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    const blob = new Blob(
        [svgData],
        { type: "image/svg+xml;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `forgeai-${diagramType}-diagram.svg`;
    link.click();

    URL.revokeObjectURL(url);
};



const handleExportPNG = async () => {
    const svg = diagramRef.current?.querySelector("svg");

    if (!svg) return;

    try {
        const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

        const viewBox = svg.viewBox.baseVal;

        const width = viewBox.width || svg.clientWidth || 1200;
        const height = viewBox.height || svg.clientHeight || 800;

        clonedSvg.setAttribute("width", `${width}`);
        clonedSvg.setAttribute("height", `${height}`);
        clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        // Remove external images and linked resources
        clonedSvg.querySelectorAll("image").forEach((element) => {
            element.remove();
        });

        clonedSvg.querySelectorAll("foreignObject").forEach((element) => {
            element.remove();
        });

        // Remove external CSS references
        clonedSvg.querySelectorAll("style").forEach((style) => {
            style.textContent = style.textContent?.replace(
                /url\((?!#)[^)]+\)/g,
                "none"
            ) || "";
        });

        const svgData = new XMLSerializer().serializeToString(clonedSvg);

        const svgUrl = URL.createObjectURL(
            new Blob([svgData], {
                type: "image/svg+xml;charset=utf-8",
            })
        );

        const image = new Image();
        image.src = svgUrl;

        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(
                new Error("Failed to load SVG")
            );
        });

        const canvas = document.createElement("canvas");

        canvas.width = width * 2;
        canvas.height = height * 2;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas context unavailable");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.scale(2, 2);
        context.drawImage(image, 0, 0, width, height);

        const pngBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("PNG conversion failed"));
            }, "image/png");
        });

        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");

        link.href = pngUrl;
        link.download = `forgeai-${diagramType}-diagram.png`;
        link.click();

        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(svgUrl);

    } catch (error) {
        console.error("PNG export failed:", error);
        setError("PNG export failed. Please try SVG export.");
    }
};




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
    <div className="space-y-4">

        <div className="flex justify-end gap-3">
            <button
                onClick={handleExportSVG}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
                Export SVG
            </button>

            <button
                onClick={handleExportPNG}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
                Export PNG
            </button>
        </div>

        <div className="overflow-auto rounded-lg border border-gray-800 bg-gray-900 p-5">
            <div
                ref={diagramRef}
                className="flex min-h-50 justify-center"
            />
        </div>

    </div>
)}


        </div>
    );
}
