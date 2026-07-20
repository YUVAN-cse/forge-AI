import Attachment from '../models/attachment.model.js';
import Task from '../models/task.model.js';


// POST   /api/tasks/:taskId/attachments

// GET    /api/tasks/:taskId/attachments

// DELETE /api/attachments/:attachmentId

// const attachmentSchema = new mongoose.Schema(
//     {
//         task: {
//             type: mongoose.Schema.Types.ObjectId,    
//             ref: 'Task',
//             required: true,
//         },
//         uploadedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },
//         fileName: {
//             type: String,
//             required: true,
//         },
//         fileUrl: {
//             type: String,
//             required: true,
//         },
//         fileType: {
//             type: String,
//             required: true,
//         },
//         fileSize: {
//             type: Number,
//             required: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// )

// const Attachment = mongoose.model('Attachment', attachmentSchema);

// export default Attachment;

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
        res.status(200).json({ status: 'success', message: 'Attachment deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export { createAttachment, getAttachmentsByTaskId, deleteAttachment };