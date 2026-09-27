// BUILD COMPLETE ARCHITECTURE
export const buildArchitecture = (
    architectureGraph,
    architectureInsights
) => {
    return {
        graph: architectureGraph,

        insights: {
            architecturePattern:
                architectureInsights.architecturePattern,

            layerFlow:
                architectureInsights.layerFlow,

            layers:
                architectureInsights.layers,

            orphanFiles:
                architectureInsights.orphanFiles,

            circularDependencies:
                architectureInsights.circularDependencies,

            architectureViolations:
                architectureInsights.architectureViolations,
        },
    };
};