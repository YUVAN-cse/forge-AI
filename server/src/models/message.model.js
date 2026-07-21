import mongoose from 'mongoose';
import Project from './project.model.js';
import User from './user.model.js';

// Message
// ├── project
// ├── sender
// ├── content
// └── timestamps

//no reciever as messages are for project and all members of the project can see the messages

const messageSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Message', messageSchema);