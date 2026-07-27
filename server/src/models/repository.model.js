import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        githubRepoId: {
            type: Number,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        fullName: {
            type: String,
            required: true,
        },

        owner: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        language: {
            type: String,
        },

        defaultBranch: {
            type: String,
            default: "main",
        },

        visibility: {
            type: String,
        },

        private: {
            type: Boolean,
            default: false,
        },

        cloneUrl: {
            type: String,
            required: true,
        },

        htmlUrl: {
            type: String,
            required: true,
        },

        importedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        importedAt: {
            type: Date,
            default: Date.now,
        },

        lastSyncedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Repository", repositorySchema);