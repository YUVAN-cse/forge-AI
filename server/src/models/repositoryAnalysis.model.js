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
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "RepositoryAnalysis",
    repositoryAnalysisSchema
);