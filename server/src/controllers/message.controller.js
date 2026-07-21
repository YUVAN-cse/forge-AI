import Message from '../models/message.model.js';
import Project from '../models/project.model.js';
import User from '../models/user.model.js';
import activityModel from '../models/activity.model.js';

const createMessage = async (req, res) => {
    try {
        const { project, content } = req.body;
        if (!project || !content) {
            return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
        }
        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({ status: 'error', message: 'Project not found' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const message = await Message.create({ project, sender: user._id, content });
        await activityModel.create({
            organization: projectExists.organization,
            project: projectExists._id,
            user: user._id,
            action: "MESSAGE_ADDED",
        });
        res.status(201).json({ status: 'success', message: 'Message created successfully', data: message });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
    }


    const getMessagesByProjectId = async (req, res) => {
        try {
            if(!req.params.projectId) {
                return res.status(400).json({ status: 'error', message: 'Project ID is required' });
            }
            const project = await Project.findById(req.params.projectId);
            if (!project) {
                return res.status(404).json({ status: 'error', message: 'Project not found' });
            }
            //user must be a member of the project to view messages
            const isMember = project.members.some(
                member => member.toString() === req.user.id.toString()
            );
            if (!isMember) {
                return res.status(403).json({ status: 'error', message: 'You are not a member of this project' });
            }
            const messages = await Message.find({ project: req.params.projectId }).populate('sender', 'name email').sort({ createdAt: 1 });
            res.status(200).json({ status: 'success', message: 'Messages found successfully', data: messages });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    const deleteMessage = async (req, res) => {
        try {
            if(!req.params.messageId) {
                return res.status(400).json({ status: 'error', message: 'Message ID is required' });
            }
            const message = await Message.findById(req.params.messageId);
            if (!message) {
                return res.status(404).json({ status: 'error', message: 'Message not found' });
            }
            //user must be the sender of the message to delete it
            if (message.sender.toString() !== req.user.id.toString()) {
                return res.status(403).json({ status: 'error', message: 'You are not the sender of this message' });
            }
            await message.deleteOne();
            const project = await Project.findById(message.project);
            if (!project) {
                return res.status(404).json({ status: 'error', message: 'Project not found' });
            }
            await activityModel.create({
                organization: project.organization,
                project: project._id,
                user: req.user.id,
                action: "MESSAGE_DELETED",
            });
            res.status(200).json({ status: 'success', message: 'Message deleted successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };


    export { createMessage, getMessagesByProjectId, deleteMessage };