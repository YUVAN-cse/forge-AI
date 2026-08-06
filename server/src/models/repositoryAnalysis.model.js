import mongoose from "mongoose";

const repositoryAnalysisSchema = new mongoose.Schema(
    {
        repository: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository",
            required: true,
            unique: true,
        },

        languages: [
            {
                type: String,
            },
        ],

        framework: {
            type: String,
        },

        packageManager: {
            type: String,
        },

        hasFrontend: {
            type: Boolean,
            default: false,
        },

        hasBackend: {
            type: Boolean,
            default: false,
        },

        hasDocker: {
            type: Boolean,
            default: false,
        },

        hasReadme: {
            type: Boolean,
            default: false,
        },

        defaultBranch: {
            type: String,
        },

        totalFiles: {
            type: Number,
            default: 0,
        },

        totalDirectories: {
            type: Number,
            default: 0,
        },

        entryPoint: { type: String, }, 
        architecture: { type: String, }, 
        controllers: { type: Number, default: 0, }, 
        services: { type: Number, default: 0, }, 
        routes: { type: Number, default: 0, }, 
        models: { type: Number, default: 0, }, 
        middleware: { type: Number, default: 0, }, 
        hasDatabase: { type: Boolean, default: false, },
        databaseType: { type: String, },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "RepositoryAnalysis",
    repositoryAnalysisSchema
);