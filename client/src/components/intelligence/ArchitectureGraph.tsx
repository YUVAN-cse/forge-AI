
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    MarkerType,
    useReactFlow,
    ReactFlowProvider,
    type Node,
    type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Architecture } from "@/types/intelligence";

interface ArchitectureGraphProps {
    architecture: Architecture;
}

const layerOrder = [
    "routes",
    "controllers",
    "services",
    "models",
    "middleware",
    "components",
    "unknown",
];

const layerColors: Record<string, string> = {
    routes: "#3b82f6",
    controllers: "#8b5cf6",
    services: "#10b981",
    models: "#f59e0b",
    middleware: "#ec4899",
    components: "#06b6d4",
    unknown: "#6b7280",
};

function GraphContent({ architecture }: ArchitectureGraphProps) {
    const [activeLayers, setActiveLayers] = useState<string[]>(
        layerOrder
    );

    const [selectedFile, setSelectedFile] = useState<string | null>(
        null
    );

    const { fitView } = useReactFlow();

    const normalizedNodes = useMemo(
        () =>
            architecture.graph.nodes.map((node) => ({
                ...node,
                layer: layerOrder.includes(node.type)
                    ? node.type
                    : "unknown",
            })),
        [architecture]
    );

    const { nodes, edges } = useMemo(() => {
        const groupedNodes = new Map<
            string,
            typeof normalizedNodes
        >();

        normalizedNodes
            .filter((node) => activeLayers.includes(node.layer))
            .forEach((node) => {
                if (!groupedNodes.has(node.layer)) {
                    groupedNodes.set(node.layer, []);
                }

                groupedNodes.get(node.layer)!.push(node);
            });

        const graphNodes: Node[] = [];
        let currentY = 0;

        layerOrder.forEach((layer) => {
            const files = groupedNodes.get(layer) || [];

            if (files.length === 0) return;

            files.forEach((file, index) => {
                graphNodes.push({
                    id: file.id,
                    position: {
                        x: (index % 4) * 300,
                        y: currentY + Math.floor(index / 4) * 130,
                    },
                    data: {
                        label: file.id.split("/").pop(),
                    },
                    style: {
                        background: "#111827",
                        color: "#fff",
                        border: `1px solid ${layerColors[layer]}`,
                        borderRadius: "10px",
                        padding: "12px",
                        width: 230,
                    },
                });
            });

            currentY +=
                Math.ceil(files.length / 4) * 130 + 100;
        });

        const visibleIds = new Set(
            graphNodes.map((node) => node.id)
        );

        const graphEdges: Edge[] = architecture.graph.edges
            .filter(
                (edge) =>
                    visibleIds.has(edge.from) &&
                    visibleIds.has(edge.to)
            )
            .map((edge, index) => ({
                id: `edge-${index}`,
                source: edge.from,
                target: edge.to,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
                style: {
                    stroke: "#6b7280",
                },
                data: {
                    relationshipType: edge.type,
                },
            }));

        return {
            nodes: graphNodes,
            edges: graphEdges,
        };
    }, [architecture, normalizedNodes, activeLayers]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fitView({
                padding: 0.2,
                duration: 300,
            });
        }, 50);

        return () => clearTimeout(timeout);
    }, [activeLayers, fitView]);

    const selectedNode = normalizedNodes.find(
        (node) => node.id === selectedFile
    );

    const incomingEdges = architecture.graph.edges.filter(
        (edge) => edge.to === selectedFile
    );

    const outgoingEdges = architecture.graph.edges.filter(
        (edge) => edge.from === selectedFile
    );

    const toggleLayer = (layer: string) => {
        setActiveLayers((previous) =>
            previous.includes(layer)
                ? previous.filter((item) => item !== layer)
                : [...previous, layer]
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                {layerOrder.map((layer) => (
                    <button
                        key={layer}
                        onClick={() => toggleLayer(layer)}
                        className={`rounded-lg border px-3 py-2 text-xs capitalize transition ${
                            activeLayers.includes(layer)
                                ? "border-gray-600 bg-gray-800 text-white"
                                : "border-gray-800 bg-gray-950 text-gray-500"
                        }`}
                    >
                        {layer}
                    </button>
                ))}

                <button
                    onClick={() => setActiveLayers([...layerOrder])}
                    className="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300"
                >
                    Select All
                </button>

                <button
                    onClick={() => setActiveLayers([])}
                    className="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300"
                >
                    Clear
                </button>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <span>Visible Files: {nodes.length}</span>
                <span>Visible Relationships: {edges.length}</span>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="h-[650px] min-w-0 overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        fitView
                        nodesDraggable
                        nodesConnectable={false}
                        elementsSelectable
                        minZoom={0.05}
                        maxZoom={2}
                        onNodeClick={(_, node) =>
                            setSelectedFile(node.id)
                        }
                    >
                        <Background />
                        <Controls />
                        <MiniMap
                            nodeColor={(node) => {
                                const file = normalizedNodes.find(
                                    (item) => item.id === node.id
                                );

                                return layerColors[
                                    file?.layer || "unknown"
                                ];
                            }}
                        />
                    </ReactFlow>
                </div>

                <div className="max-h-[650px] overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 p-5">
                    {selectedNode ? (
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-white">
                                    File Inspector
                                </h3>

                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Close
                                </button>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    File Path
                                </p>

                                <p className="mt-1 break-all text-sm text-white">
                                    {selectedNode.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Architectural Layer
                                </p>

                                <p className="mt-1 capitalize text-white">
                                    {selectedNode.layer}
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-white">
                                    Outgoing ({outgoingEdges.length})
                                </h4>

                                {outgoingEdges.length === 0 && (
                                    <p className="text-xs text-gray-500">
                                        No outgoing relationships.
                                    </p>
                                )}

                                {outgoingEdges.map((edge, index) => (
                                    <div
                                        key={index}
                                        className="mb-2 rounded-lg bg-gray-950 p-3 text-xs"
                                    >
                                        <p className="break-all text-gray-200">
                                            {edge.to}
                                        </p>

                                        <p className="mt-1 text-gray-500">
                                            {edge.type}
                                            {edge.method &&
                                                ` · ${edge.method}`}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-white">
                                    Incoming ({incomingEdges.length})
                                </h4>

                                {incomingEdges.length === 0 && (
                                    <p className="text-xs text-gray-500">
                                        No incoming relationships.
                                    </p>
                                )}

                                {incomingEdges.map((edge, index) => (
                                    <div
                                        key={index}
                                        className="mb-2 rounded-lg bg-gray-950 p-3 text-xs"
                                    >
                                        <p className="break-all text-gray-200">
                                            {edge.from}
                                        </p>

                                        <p className="mt-1 text-gray-500">
                                            {edge.type}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white">
                                File Inspector
                            </h3>

                            <p className="text-sm text-gray-400">
                                Click a node to inspect its architectural
                                role and relationships.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ArchitectureGraph({
    architecture,
}: ArchitectureGraphProps) {
    return (
        <ReactFlowProvider>
            <GraphContent architecture={architecture} />
        </ReactFlowProvider>
    );
}
