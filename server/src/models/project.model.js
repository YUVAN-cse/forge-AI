import mongoose from 'mongoose';
import Organization from './organization.model.js';
import User from './user.model.js';

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "ARCHIVED"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Project', projectSchema);