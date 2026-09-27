// DETECT CIRCULAR DEPENDENCIES
export const detectCircularDependencies = (
    nodes,
    edges
) => {
    const graph = new Map();

    nodes.forEach((node) => {
        graph.set(node.id, []);
    });

    edges.forEach((edge) => {
        if (!graph.has(edge.from)) {
            graph.set(edge.from, []);
        }

        graph.get(edge.from).push(edge.to);
    });

    const cycles = [];
    const visited = new Set();
    const recursionStack = new Set();

    const dfs = (node, path) => {
        visited.add(node);
        recursionStack.add(node);

        const neighbors =
            graph.get(node) || [];

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfs(
                    neighbor,
                    [...path, neighbor]
                );
                continue;
            }

            if (recursionStack.has(neighbor)) {
                const cycleStart =
                    path.indexOf(neighbor);

                const cycle =
                    cycleStart !== -1
                        ? path.slice(cycleStart)
                        : [neighbor];

                cycle.push(neighbor);

                cycles.push(cycle);
            }
        }

        recursionStack.delete(node);
    };

    nodes.forEach((node) => {
        if (!visited.has(node.id)) {
            dfs(node.id, [node.id]);
        }
    });

    return removeDuplicateCycles(cycles);
};

// REMOVE DUPLICATE CYCLES
const removeDuplicateCycles = (
    cycles
) => {
    const unique = new Set();
    const result = [];

    cycles.forEach((cycle) => {
        const normalized =
            [...cycle]
                .slice(0, -1)
                .sort()
                .join("|");

        if (unique.has(normalized)) {
            return;
        }

        unique.add(normalized);
        result.push(cycle);
    });

    return result;
};