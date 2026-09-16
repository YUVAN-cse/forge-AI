// DETECT ARCHITECTURE LAYERS
export const detectLayers = (nodes) => {
    const layers = {
        routes: [],
        controllers: [],
        services: [],
        models: [],
        middleware: [],
        components: [],
        files: [],
    };

    nodes.forEach((node) => {
        if (node.type === "route") {
            layers.routes.push(node.id);
        } else if (node.type === "controller") {
            layers.controllers.push(node.id);
        } else if (node.type === "service") {
            layers.services.push(node.id);
        } else if (node.type === "model") {
            layers.models.push(node.id);
        } else if (node.type === "middleware") {
            layers.middleware.push(node.id);
        } else if (node.type === "component") {
            layers.components.push(node.id);
        } else {
            layers.files.push(node.id);
        }
    });

    return layers;
};

// DETECT LAYER FLOW
export const detectLayerFlow = (layers) => {
    const flow = [];

    if (layers.components.length > 0) {
        flow.push("components");
    }

    if (layers.routes.length > 0) {
        flow.push("routes");
    }

    if (layers.middleware.length > 0) {
        flow.push("middleware");
    }

    if (layers.controllers.length > 0) {
        flow.push("controllers");
    }

    if (layers.services.length > 0) {
        flow.push("services");
    }

    if (layers.models.length > 0) {
        flow.push("models");
    }

    return flow;
};

// BUILD ARCHITECTURE INSIGHTS
export const buildArchitectureInsights = (
    architectureGraph
) => {
    const layers =
        detectLayers(
            architectureGraph.nodes
        );

    const layerFlow =
        detectLayerFlow(layers);

    return {
        layers,
        layerFlow,
    };
};