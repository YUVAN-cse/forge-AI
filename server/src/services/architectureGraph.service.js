// BUILD ARCHITECTURE GRAPH
export const buildArchitectureGraph = (
    files,
    relationships
) => {
    const nodes = [];
    const nodeMap = new Map();

    files.forEach((file) => {
        const node = {
            id: file.path,
            type: getNodeType(file.path),
        };

        nodes.push(node);
        nodeMap.set(file.path, node);
    });

    const edges = relationships.map((relationship) => ({
        from: relationship.from,
        to: relationship.to,
        type: relationship.type,
        symbol: relationship.symbol || null,
        method: relationship.method || null,
    }));

    return {
        nodes,
        edges,
    };
};

// GET NODE TYPE
const getNodeType = (filePath) => {
    const path = filePath.toLowerCase();

    if (
        path.includes("/routes/") ||
        path.includes("/route/") ||
        path.includes("routes.") ||
        path.includes(".route.")
    ) {
        return "route";
    }

    if (
        path.includes("/controllers/") ||
        path.includes("/controller/") ||
        path.includes("controllers.") ||
        path.includes(".controller.")
    ) {
        return "controller";
    }

    if (
        path.includes("/services/") ||
        path.includes("/service/") ||
        path.includes("services.") ||
        path.includes(".service.")
    ) {
        return "service";
    }

    if (
        path.includes("/models/") ||
        path.includes("/model/") ||
        path.includes("models.") ||
        path.includes(".model.")
    ) {
        return "model";
    }

    if (
        path.includes("/middleware/") ||
        path.includes("/middlewares/") ||
        path.includes("middleware.")
    ) {
        return "middleware";
    }

    if (
        path.includes("/components/") ||
        path.includes("/component/")
    ) {
        return "component";
    }

    return "file";
};