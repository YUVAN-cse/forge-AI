export interface ArchitectureNode {
    id: string;
    type: string;
}

export interface ArchitectureEdge {
    from: string;
    to: string;
    type: string;
    symbol?: string | null;
    method?: string | null;
}

export interface ArchitectureInsights {
    architecturePattern: string;
    layerFlow: string[];
    layers: Record<string, string[]>;
    orphanFiles: string[];
    circularDependencies: string[][];
    architectureViolations: {
        from: string;
        to: string;
        type: string;
        message: string;
    }[];
}

export interface Architecture {
    graph: {
        nodes: ArchitectureNode[];
        edges: ArchitectureEdge[];
    };
    insights: ArchitectureInsights;
}

export interface CodebaseUnderstanding {
    entryPoints: string[];
    folders: Record<string, unknown>;
    importantFiles: string[];
    configurations: string[];
    dependencies: unknown[];
    codeStructure: Record<string, unknown>;
    relationships: ArchitectureEdge[];
    architecture: Architecture;
}