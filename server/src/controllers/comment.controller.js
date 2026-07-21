import Comment from '../models/comment.model.js';
import Task from '../models/task.model.js';
import User from '../models/user.model.js';
import activityModel from '../models/activity.model.js';

const createComment = async (req, res) => {
    try {
        const { content, taskId } = req.body;
        if (!content || !taskId) {
            return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
        }
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        await activityModel.create({
            organization: task.project.organization,
            project: task.project._id,
            task: task._id,
            user: user._id,
            action: "COMMENT_ADDED",
        });
        const comment = await Comment.create({ content, task, user });
        res.status(201).json({ status: 'success', message: 'Comment created successfully', comment });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getCommentsByTaskId = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);        
        if (!task) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }

        const comments = await Comment.find({ task: req.params.taskId }).populate('user', 'name email');
        res.status(200).json({ status: 'success', message: 'Comments found successfully', comments });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};


const updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ status: 'error', message: 'Comment not found' });
        }
        comment.content = content;
        await comment.save();
        await activityModel.create({
            organization: comment.task.project.organization,
            project: comment.task.project._id,
            task: comment.task._id,
            user: req.user.id,
            action: "COMMENT_UPDATED",
        });
        res.status(200).json({ status: 'success', message: 'Comment updated successfully', comment });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};


const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ status: 'error', message: 'Comment not found' });
        }
        if(comment.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ status: 'error', message: 'You are not authorized to delete this comment' });
        }
        
        await comment.deleteOne();
        await activityModel.create({
            organization: comment.task.project.organization,
            project: comment.task.project._id,
            task: comment.task._id,
            user: req.user.id,
            action: "COMMENT_DELETED",
        });
        res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export { createComment, getCommentsByTaskId, updateComment, deleteComment };