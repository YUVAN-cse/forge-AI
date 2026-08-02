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
        analysisStatus: {
            type: String,
            enum: [
                "NOT_ANALYZED",
                "ANALYZING",
                "ANALYZED",
                "FAILED",
            ],
            default: "NOT_ANALYZED",
        },

        analyzedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

repositorySchema.index(
    {
        project: 1,
        githubRepoId: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model("Repository", repositorySchema);