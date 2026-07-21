import Message from '../models/message.model.js';
import Project from '../models/project.model.js';
import User from '../models/user.model.js';
import activityModel from '../models/activity.model.js';
import { createMessageService, deleteMessageService } from '../services/message.service.js';

    const createMessage = async (req, res) => {
        try {
            const { project, content } = req.body;

            const message = await createMessageService({
                projectId: project,
                userId: req.user._id,
                content
            });

            res.status(201).json({
                status: 'success',
                message: 'Message created successfully',
                data: message
            });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    };


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
            const { messageId } = req.params;
            const message = await deleteMessageService({ messageId, userId: req.user._id });
            if (!message) {
                return res.status(404).json({ status: 'error', message: 'Message not found' });
            }
            res.status(200).json({ status: 'success', message: 'Message deleted successfully', data: message });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };


    export { createMessage, getMessagesByProjectId, deleteMessage };