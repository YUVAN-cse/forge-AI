import activityModel from "../models/activity.model.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";


// GET /api/projects/:projectId/activity

// GET /api/tasks/:taskId/activity

const getActivityByProjectId = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ status: 'error', message: 'Project not found' });
        }
        const activities = await activityModel.find({ project: req.params.projectId }).populate('user', 'name email');
        res.status(200).json({ status: 'success', message: 'Activities found successfully', activities });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getActivityByTaskId = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }
        const activities = (await activityModel.find({ task: req.params.taskId }).populate('user', 'name email'));
        res.status(200).json({ status: 'success', message: 'Activities found successfully', activities });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message }).reverse();
    }
};

export { getActivityByProjectId, getActivityByTaskId };