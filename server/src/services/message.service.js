import Project from '../models/project.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

// Find project
//     ↓
// Find user
//     ↓
// Check project membership
//     ↓
// Create message
//     ↓
// Create activity

// Save first, broadcast second.

const createMessageService = async ({ projectId, userId, content }) => {
    // Find project
    const project = await Project.findById(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check project membership of user
    if (!project.members.includes(user._id)) {
        throw new Error('You are not a member of this project');
    }

    // Create message
    const message = await Message.create({ project: project._id, sender: user._id, content });
    await activityModel.create({
        organization: project.organization,
        project: project._id,
        user: user._id,
        action: "MESSAGE_ADDED",
    });
    return message;
};

const deleteMessageService = async ({ messageId, userId }) => {
    const message = await Message.findById(messageId);
    if (!message) {
        throw new Error('Message not found');
    }
    if (message.sender.toString() !== userId) {
        throw new Error('You are not the sender of this message');
    }
    await message.deleteOne();
    const project = await Project.findById(message.project);
    if (!project) {
        throw new Error('Project not found');
    }
    await activityModel.create({
        organization: project.organization,
        project: project._id,
        user: userId,
        action: "MESSAGE_DELETED",
    });
    return message;
};

export { createMessageService, deleteMessageService };