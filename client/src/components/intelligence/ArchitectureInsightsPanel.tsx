
"use client";

import {
    AlertTriangle,
    GitBranch,
    Layers,
    FileQuestion,
    ShieldAlert,
    CheckCircle2,
} from "lucide-react";

import { ArchitectureInsights } from "@/types/intelligence";

interface ArchitectureInsightsPanelProps {
    insights: ArchitectureInsights;
}

export default function ArchitectureInsightsPanel({
    insights,
}: ArchitectureInsightsPanelProps) {
    const {
        architecturePattern,
        layerFlow,
        layers,
        orphanFiles,
        circularDependencies,
        architectureViolations,
    } = insights;

    const layerEntries = Object.entries(layers || {});
    const cycles = circularDependencies || [];
    const violations = architectureViolations || [];
    const orphans = orphanFiles || [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-white">
                    Architecture Insights
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                    Understand architectural patterns, dependencies,
                    and potential design issues.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Layers size={19} className="text-blue-400" />
                        <h3 className="font-semibold text-white">
                            Detected Architecture
                        </h3>
                    </div>

                    <p className="text-xl font-semibold text-white">
                        {architecturePattern || "Unknown"}
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                        Inferred from repository structure and
                        detected code relationships.
                    </p>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <GitBranch size={19} className="text-purple-400" />
                        <h3 className="font-semibold text-white">
                            Detected Layer Flow
                        </h3>
                    </div>

                    {layerFlow?.length ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {layerFlow.map((layer, index) => (
                                <div
                                    key={`${layer}-${index}`}
                                    className="flex items-center gap-2"
                                >
                                    {index > 0 && (
                                        <span className="text-gray-500">
                                            →
                                        </span>
                                    )}

                                    <span className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-xs capitalize text-gray-200">
                                        {layer}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No layer flow detected.
                        </p>
                    )}

                    <p className="mt-4 text-xs text-gray-500">
                        This is an inferred architectural flow,
                        not a verified runtime execution path.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 font-semibold text-white">
                    Architectural Layers
                </h3>

                {layerEntries.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No architectural layers detected.
                    </p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {layerEntries.map(([layer, files]) => (
                            <div
                                key={layer}
                                className="rounded-lg border border-gray-800 bg-gray-950 p-4"
                            >
                                <p className="text-sm capitalize text-gray-400">
                                    {layer}
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-white">
                                    {files.length}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Detected files
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <AlertTriangle
                            size={19}
                            className="text-amber-400"
                        />
                        <h3 className="font-semibold text-white">
                            Circular Dependencies ({cycles.length})
                        </h3>
                    </div>

                    {cycles.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <CheckCircle2
                                size={17}
                                className="text-green-400"
                            />
                            No circular dependencies detected.
                        </div>
                    ) : (
                        <div className="max-h-72 space-y-3 overflow-y-auto">
                            {cycles.map((cycle, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-gray-800 bg-gray-950 p-4"
                                >
                                    <p className="mb-2 text-xs font-medium text-amber-400">
                                        Cycle {index + 1}
                                    </p>

                                    <p className="break-all text-xs leading-6 text-gray-300">
                                        {cycle.join(" → ")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <FileQuestion
                            size={19}
                            className="text-blue-400"
                        />
                        <h3 className="font-semibold text-white">
                            Potentially Disconnected Files ({orphans.length})
                        </h3>
                    </div>

                    {orphans.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <CheckCircle2
                                size={17}
                                className="text-green-400"
                            />
                            No disconnected files detected.
                        </div>
                    ) : (
                        <div className="max-h-72 space-y-2 overflow-y-auto">
                            {orphans.map((file) => (
                                <div
                                    key={file}
                                    className="break-all rounded-lg bg-gray-950 p-3 text-xs text-gray-300"
                                >
                                    {file}
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="mt-4 text-xs text-gray-500">
                        Disconnected files have no detected import
                        relationships. They are not necessarily unused.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4 flex items-center gap-2">
                    <ShieldAlert
                        size={19}
                        className="text-red-400"
                    />

                    <h3 className="font-semibold text-white">
                        Architecture Violations ({violations.length})
                    </h3>
                </div>

                {violations.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle2
                            size={17}
                            className="text-green-400"
                        />
                        No architecture violations detected.
                    </div>
                ) : (
                    <div className="max-h-96 space-y-3 overflow-y-auto">
                        {violations.map((violation, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-red-900/40 bg-gray-950 p-4"
                            >
                                <p className="text-sm font-medium text-red-400">
                                    {violation.type}
                                </p>

                                <p className="mt-2 text-sm text-gray-300">
                                    {violation.message}
                                </p>

                                <div className="mt-3 space-y-1 text-xs text-gray-500">
                                    <p className="break-all">
                                        From: {violation.from}
                                    </p>
                                    <p className="break-all">
                                        To: {violation.to}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
