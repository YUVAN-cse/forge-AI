
import {
    Files,
    GitBranch,
    Network,
    FileQuestion,
    RefreshCw,
    ShieldAlert,
} from "lucide-react";

import { Architecture } from "@/types/intelligence";

interface IntelligenceOverviewCardsProps {
    architecture: Architecture;
}

export default function IntelligenceOverviewCards({
    architecture,
}: IntelligenceOverviewCardsProps) {
    const { graph, insights } = architecture;

    const cards = [
        {
            title: "Source Files",
            value: graph.nodes.length,
            icon: Files,
        },
        {
            title: "Relationships",
            value: graph.edges.length,
            icon: GitBranch,
        },
        {
            title: "Architecture",
            value: insights.architecturePattern || "Unknown",
            icon: Network,
        },
        {
            title: "Orphan Files",
            value: insights.orphanFiles?.length ?? 0,
            icon: FileQuestion,
        },
        {
            title: "Circular Dependencies",
            value: insights.circularDependencies?.length ?? 0,
            icon: RefreshCw,
        },
        {
            title: "Architecture Violations",
            value: insights.architectureViolations?.length ?? 0,
            icon: ShieldAlert,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-400">
                                {card.title}
                            </p>

                            <Icon
                                size={19}
                                className="text-gray-500"
                            />
                        </div>

                        <p className="break-words text-2xl font-semibold text-white">
                            {card.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
