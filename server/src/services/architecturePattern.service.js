// DETECT ARCHITECTURE PATTERN
export const detectArchitecturePattern = (
    layers,
    relationships
) => {
    const layerFlow = [];

    if (layers.routes?.length > 0) {
        layerFlow.push("routes");
    }

    if (layers.controllers?.length > 0) {
        layerFlow.push("controllers");
    }

    if (layers.services?.length > 0) {
        layerFlow.push("services");
    }

    if (layers.models?.length > 0) {
        layerFlow.push("models");
    }

    const hasLayeredFlow =
        layerFlow.includes("controllers") &&
        layerFlow.includes("services") &&
        layerFlow.includes("models");

    const hasControllerService =
        relationships.some(
            (relationship) =>
                relationship.type ===
                "controller_calls_service"
        );

    const hasServiceModel =
        relationships.some(
            (relationship) =>
                relationship.type ===
                "service_uses_model"
        );

    if (
        hasLayeredFlow &&
        hasControllerService &&
        hasServiceModel
    ) {
        return "Layered Architecture";
    }

    if (
        layers.controllers?.length > 0 &&
        layers.services?.length > 0
    ) {
        return "Service-Based Architecture";
    }

    if (
        layers.components?.length > 0 &&
        layers.services?.length > 0
    ) {
        return "Component-Based Architecture";
    }

    return "Unclassified";
};