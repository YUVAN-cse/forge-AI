// DETECT ARCHITECTURE VIOLATIONS
export const detectArchitectureViolations = (
    relationships,
    architecturePattern
) => {
    if (
        architecturePattern !==
        "Layered Architecture"
    ) {
        return [];
    }

    const violations = [];

    relationships.forEach((relationship) => {
        const fromRole =
            getRelationshipRole(
                relationship.type,
                "from"
            );

        const toRole =
            getRelationshipRole(
                relationship.type,
                "to"
            );

        if (!fromRole || !toRole) {
            return;
        }

        if (
            !isAllowedLayerDependency(
                fromRole,
                toRole
            )
        ) {
            violations.push({
                from: relationship.from,
                to: relationship.to,
                type: relationship.type,
                message:
                    `${fromRole} should not directly depend on ${toRole}.`,
            });
        }
    });

    return violations;
};

// GET ROLES FROM RELATIONSHIP TYPE
const getRelationshipRole = (
    relationshipType,
    direction
) => {
    const roles = {
        route_calls_controller: [
            "routes",
            "controllers",
        ],

        controller_calls_service: [
            "controllers",
            "services",
        ],

        service_uses_model: [
            "services",
            "models",
        ],

        route_uses_middleware: [
            "routes",
            "middleware",
        ],

        controller_uses_middleware: [
            "controllers",
            "middleware",
        ],
    };

    const relationship =
        roles[relationshipType];

    if (!relationship) {
        return null;
    }

    return direction === "from"
        ? relationship[0]
        : relationship[1];
};

// CHECK ALLOWED DEPENDENCY
const isAllowedLayerDependency = (
    fromRole,
    toRole
) => {
    const allowedDependencies = {
        routes: [
            "controllers",
            "middleware",
        ],

        controllers: [
            "services",
            "middleware",
        ],

        services: [
            "models",
        ],

        models: [],

        middleware: [],
    };

    return (
        allowedDependencies[fromRole]
            ?.includes(toRole) ?? false
    );
};