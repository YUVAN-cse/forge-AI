import Attachment from '../models/attachment.model.js';
import Task from '../models/task.model.js';
import User from '../models/user.model.js';
import activityModel from '../models/activity.model.js';

const createAttachment = async (req, res) => {
    try {
        const { fileName, fileUrl, fileType, fileSize , taskId} = req.body;
        if(!taskId) {
            return res.status(400).json({ status: 'error', message: 'Task ID is required' });
        }
        if (!fileName || !fileUrl || !fileType || !fileSize) {
            return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
        }
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }
        const attachment = await Attachment.create({ task : taskId, uploadedBy: req.user.id, fileName, fileUrl, fileType, fileSize });
        await activityModel.create({
            organization: task.project.organization,
            project: task.project._id,
            task: task._id,
            user: req.user.id,
            action: "ATTACHMENT_UPLOADED",
        });
        res.status(201).json({ status: 'success', message: 'Attachment created successfully', attachment });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getAttachmentsByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({ status: 'error', message: 'Task ID is required' });
        }
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }
        const attachments = await Attachment.find({ task: taskId }).populate('uploadedBy', 'name email');
        res.status(200).json({ status: 'success', message: 'Attachments found successfully', attachments });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const deleteAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        if (!attachmentId) {
            return res.status(400).json({ status: 'error', message: 'Attachment ID is required' });
        }
        const attachment = await Attachment.findById(attachmentId);
        if (!attachment) {
            return res.status(404).json({ status: 'error', message: 'Attachment not found' });
        }
        if (attachment.uploadedBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ status: 'error', message: 'You are not authorized to delete this attachment' });
        }
        await attachment.deleteOne();
        await activityModel.create({
            organization: attachment.task.project.organization,
            project: attachment.task.project._id,
            task: attachment.task._id,
            user: req.user.id,
            action: "ATTACHMENT_DELETED",
        });
        res.status(200).json({ status: 'success', message: 'Attachment deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export { createAttachment, getAttachmentsByTaskId, deleteAttachment };