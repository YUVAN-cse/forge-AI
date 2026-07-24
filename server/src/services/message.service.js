import Project from '../models/project.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import activityModel from '../models/activity.model.js';

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

const createMessageService = async ({
    projectId,
    userId,
    content,
}) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }


    const message = await Message.create({
        project: projectId,
        sender: userId,
        content,
    });

    await activityModel.create({
        organization: project.organization,
        project: project._id,
        user: userId,
        action: "MESSAGE_ADDED",
    });

    return await Message.findById(message._id)
        .populate("sender", "name email");
};

const deleteMessageService = async ({
    messageId,
    userId,
}) => {
    const message = await Message.findById(messageId);

    if (!message) {
        throw new Error("Message not found");
    }

    console.log("Message sender:", message.sender.toString());
    console.log("Current user:", userId.toString());

    if (
        message.sender.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "You are not the sender of this message"
        );
    }

    const project = await Project.findById(
        message.project
    );

    await message.deleteOne();

    await activityModel.create({
        organization: project.organization,
        project: project._id,
        user: userId,
        action: "MESSAGE_DELETED",
    });

    return {
        messageId: message._id,
        projectId: message.project,
    };
};

export { createMessageService, deleteMessageService };