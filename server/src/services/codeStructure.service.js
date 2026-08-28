// ==========================================
// FILE CLASSIFICATION
// ==========================================

const classifyFile = (filePath) => {

    const path = filePath.toLowerCase();

    const fileName =
        path.split("/").pop();

    // ------------------------------------------
    // ROUTES
    // ------------------------------------------

    if (
        path.includes("/routes/") ||
        fileName.includes("route")
    ) {
        return "route";
    }


    // ------------------------------------------
    // CONTROLLERS
    // ------------------------------------------

    if (
        path.includes("/controllers/") ||
        fileName.includes("controller")
    ) {
        return "controller";
    }


    // ------------------------------------------
    // SERVICES
    // ------------------------------------------

    if (
        path.includes("/services/") ||
        fileName.includes("service")
    ) {
        return "service";
    }


    // ------------------------------------------
    // MODELS
    // ------------------------------------------

    if (
        path.includes("/models/") ||
        fileName.includes("model")
    ) {
        return "model";
    }


    // ------------------------------------------
    // MIDDLEWARE
    // ------------------------------------------

    if (
        path.includes("/middleware/") ||
        fileName.includes("middleware")
    ) {
        return "middleware";
    }


    // ------------------------------------------
    // COMPONENTS
    // ------------------------------------------

    if (
        path.includes("/components/") ||
        fileName.includes("component")
    ) {
        return "component";
    }


    // ------------------------------------------
    // CONFIG
    // ------------------------------------------

    if (
        path.includes("/config/") ||
        fileName.includes("config")
    ) {
        return "config";
    }


    // ------------------------------------------
    // UTILS / HELPERS
    // ------------------------------------------

    if (
        path.includes("/utils/") ||
        path.includes("/helpers/") ||
        fileName.includes("util") ||
        fileName.includes("helper")
    ) {
        return "utility";
    }


    return "unknown";
};


// ==========================================
// BUILD CODE STRUCTURE
// ==========================================

export const buildCodeStructure = (tree) => {

    const structure = {

        routes: [],

        controllers: [],

        services: [],

        models: [],

        middleware: [],

        components: [],

        configs: [],

        utilities: [],

        unknown: [],

    };


    // Only analyze files
    const files = tree.filter(
        (item) => item.type === "blob"
    );


    files.forEach((file) => {

        const type =
            classifyFile(file.path);


        switch (type) {

            case "route":
                structure.routes.push(file.path);
                break;

            case "controller":
                structure.controllers.push(file.path);
                break;

            case "service":
                structure.services.push(file.path);
                break;

            case "model":
                structure.models.push(file.path);
                break;

            case "middleware":
                structure.middleware.push(file.path);
                break;

            case "component":
                structure.components.push(file.path);
                break;

            case "config":
                structure.configs.push(file.path);
                break;

            case "utility":
                structure.utilities.push(file.path);
                break;

            default:
                structure.unknown.push(file.path);

        }

    });


    return structure;

};