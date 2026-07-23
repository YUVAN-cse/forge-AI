import Task from '../models/task.model.js';
import Project from '../models/project.model.js';
import Organization from '../models/organization.model.js';
import User from '../models/user.model.js';
import activityModel from '../models/activity.model.js';

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            assignedTo,
            project,
            dueDate
        } = req.body;

        if (!title || !project) {
            return res.status(400).json({
                status: "error",
                message: "Title and Project are required"
            });
        }

        const projectExists = await Project.findById(project);

        if (!projectExists) {
            return res.status(404).json({
                status: "error",
                message: "Project not found"
            });
        }

        const organization = await Organization.findById(
            projectExists.organization
        );

        if (!organization) {
            return res.status(404).json({
                status: "error",
                message: "Organization not found"
            });
        }

        const isMember = organization.members.some(
            member =>
                member.toString() === req.user.id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not a member of this organization"
            });
        }

        if (assignedTo) {
            const userExists = await User.findById(assignedTo);

            if (!userExists) {
                return res.status(404).json({
                    status: "error",
                    message: "Assigned user not found"
                });
            }

            const isAssignedUserMember =
                organization.members.some(
                    member =>
                        member.toString() ===
                        assignedTo.toString()
                );

            if (!isAssignedUserMember) {
                return res.status(400).json({
                    status: "error",
                    message:
                        "Assigned user is not a member of this organization"
                });
            }
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            assignedTo: assignedTo || null,
            project,
            dueDate,
            createdBy: req.user._id
        });

        await activityModel.create({
            organization: organization._id,
            project: projectExists._id,
            task: task._id,
            user: req.user._id,
            action: "TASK_CREATED"
        });

        res.status(201).json({
            status: "success",
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


const getTasksByProjectId = async (req, res) => {
    try {
        const project = await Project.findById(
            req.params.projectId
        );

        if (!project) {
            return res.status(404).json({
                status: "error",
                message: "Project not found"
            });
        }

        const organization = await Organization.findById(
            project.organization
        );

        if (!organization) {
            return res.status(404).json({
                status: "error",
                message: "Organization not found"
            });
        }

        const isMember = organization.members.some(
            member =>
                member.toString() === req.user.id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized"
            });
        }

        const tasks = await Task.find({
            project: req.params.projectId
        })
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        res.status(200).json({
            status: "success",
            tasks
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.taskId
        );

        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found"
            });
        }

        const project = await Project.findById(
            task.project
        );

        if (!project) {
            return res.status(404).json({
                status: "error",
                message: "Project not found"
            });
        }

        const organization = await Organization.findById(
            project.organization
        );

        if (!organization) {
            return res.status(404).json({
                status: "error",
                message: "Organization not found"
            });
        }

        const isMember = organization.members.some(
            member =>
                member.toString() === req.user.id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not a member of this organization"
            });
        }

        if (req.body.assignedTo) {
            const assignedUser =
                await User.findById(req.body.assignedTo);

            if (!assignedUser) {
                return res.status(404).json({
                    status: "error",
                    message: "Assigned user not found"
                });
            }

            const isAssignedUserMember =
                organization.members.some(
                    member =>
                        member.toString() ===
                        req.body.assignedTo.toString()
                );

            if (!isAssignedUserMember) {
                return res.status(400).json({
                    status: "error",
                    message:
                        "Assigned user is not a member of this organization"
                });
            }

            task.assignedTo = req.body.assignedTo;
        }

        task.title =
            req.body.title ?? task.title;

        task.description =
            req.body.description ?? task.description;

        task.status =
            req.body.status ?? task.status;

        task.priority =
            req.body.priority ?? task.priority;

        task.dueDate =
            req.body.dueDate ?? task.dueDate;

        await task.save();

        await activityModel.create({
            organization: organization._id,
            project: project._id,
            task: task._id,
            user: req.user._id,
            action: "TASK_UPDATED"
        });

        const updatedTask = await Task.findById(
            task._id
        )
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        res.status(200).json({
            status: "success",
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.taskId
        );

        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found"
            });
        }

        const project = await Project.findById(
            task.project
        );

        if (!project) {
            return res.status(404).json({
                status: "error",
                message: "Project not found"
            });
        }

        const organization = await Organization.findById(
            project.organization
        );

        if (!organization) {
            return res.status(404).json({
                status: "error",
                message: "Organization not found"
            });
        }

        const isMember = organization.members.some(
            member =>
                member.toString() === req.user.id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not a member of this organization"
            });
        }

        await task.deleteOne();

        await activityModel.create({
            organization: organization._id,
            project: project._id,
            task: task._id,
            user: req.user._id,
            action: "TASK_DELETED"
        });

        res.status(200).json({
            status: "success",
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


export {
    createTask,
    getTasksByProjectId,
    updateTask,
    deleteTask
};