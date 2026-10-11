"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRepositoryIntelligence } from "@/services/intelligence.service";
import { CodebaseUnderstanding } from "@/types/intelligence";
import IntelligenceOverviewCards from "@/components/intelligence/IntelligenceOverviewCards";
import ArchitectureGraph from "@/components/intelligence/ArchitectureGraph";
import ArchitectureInsightsPanel from "@/components/intelligence/ArchitectureInsightsPanel";

export default function RepositoryIntelligencePage() {
    const { repositoryId } = useParams<{
        repositoryId: string;
    }>();

    const [intelligence, setIntelligence] =
        useState<CodebaseUnderstanding | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!repositoryId) return;

        const fetchIntelligence = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getRepositoryIntelligence(repositoryId);

                setIntelligence(data);
            } catch (error) {
                setError("Failed to load repository intelligence.");
            } finally {
                setLoading(false);
            }
        };

        fetchIntelligence();
    }, [repositoryId]);

    if (loading) {
        return (
            <div className="p-8 text-gray-400">
                Loading repository intelligence...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-400">
                {error}
            </div>
        );
    }

    if (!intelligence) {
        return (
            <div className="p-8 text-gray-400">
                No intelligence data available.
            </div>
        );
    }

    return (
    <div className="space-y-10 p-8">
        <div>
            <h1 className="text-2xl font-semibold text-white">
                Repository Intelligence
            </h1>

            <p className="mt-2 text-gray-400">
                Explore code structure, architecture,
                dependencies, and repository insights.
            </p>
        </div>

        <IntelligenceOverviewCards
            architecture={intelligence.architecture}
        />

        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
                Architecture Graph
            </h2>

            <ArchitectureGraph
                architecture={intelligence.architecture}
            />
        </div>

        <ArchitectureInsightsPanel
            insights={intelligence.architecture.insights}
        />
    </div>
);
}