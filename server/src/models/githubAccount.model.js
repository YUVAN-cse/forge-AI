import mongoose from "mongoose";

const githubAccountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        githubId: {
            type: Number,
            required: true,
            unique: true,
        },

        username: {
            type: String,
            required: true,
        },

        displayName: {
            type: String,
        },

        avatarUrl: {
            type: String,
        },

        profileUrl: {
            type: String,
        },

        accessToken: {
            type: String,
            required: true,
        },

        connectedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("GithubAccount", githubAccountSchema);