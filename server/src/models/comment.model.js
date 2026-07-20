import mongoose from 'mongoose';
import Task from './task.model.js';
import User from './user.model.js';

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Comment', commentSchema);