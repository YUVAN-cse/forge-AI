import mongoose from 'mongoose';
import Organization from './organization.model.js';
import Project from './project.model.js';
import Task from './task.model.js';
import User from './user.model.js';

// {
//     organization: ObjectId,

//     project: ObjectId,

//     task: ObjectId,      // optional

//     user: ObjectId,

//     action: String,

//     metadata: Object      // optional
// }

const activitySchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            enum: [
                "PROJECT_CREATED",
                "PROJECT_UPDATED",
                "PROJECT_DELETED",

                "TASK_CREATED",
                "TASK_UPDATED",
                "TASK_DELETED",
                "TASK_STATUS_CHANGED",

                "COMMENT_ADDED",
                "COMMENT_UPDATED",
                "COMMENT_DELETED",

                "ATTACHMENT_UPLOADED",
                "ATTACHMENT_DELETED",

                "MEMBER_ADDED",
                "MEMBER_REMOVED"
            ],
            required: true,
        },
        metadata: {
            type: Object,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Activity', activitySchema);