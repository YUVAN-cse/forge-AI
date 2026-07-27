import getProjectContext
    from "../services/projectContext.service.js";

import selectProjectContext
    from "../utils/selectProjectContext.js";

import {
    generateProjectAnswer,
} from "../services/ai.service.js";

import Project
    from "../models/project.model.js";

import Task from "../models/task.model.js";

import {
    generateTaskHelp,
} from "../services/ai.service.js";

import {
    generateProjectTasks,
} from "../services/ai.service.js";


// Existing context endpoint
const getProjectContextController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const context =
            await getProjectContext(projectId);

        return res.status(200).json({
            status: "success",
            context,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};


// New AI Q&A endpoint
const askProjectAI = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                status: "error",
                message: "Question is required",
            });
        }

        const project =
            await Project.findById(projectId)
                .populate("organization");

        if (!project) {
            return res.status(404).json({
                status: "error",
                message: "Project not found",
            });
        }

        const organization =
            project.organization;

        const userId =
            req.user.id.toString();

        const isOwner =
            organization.owner.toString() === userId;

        const isMember =
            organization.members.some(
                (member) =>
                    member.toString() === userId
            );

        if (!isOwner && !isMember) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not a member of this organization",
            });
        }

        const projectContext =
            await getProjectContext(projectId);

        const selectedContext =
            selectProjectContext(
                question,
                projectContext
            );

        const answer =
            await generateProjectAnswer({
                question: question.trim(),
                context: selectedContext,
            });

        return res.status(200).json({
            status: "success",
            question: question.trim(),
            answer,
        });

    } catch (error) {
        console.error(
            "AI PROJECT ERROR:",
            error
        );

        return res.status(500).json({
            status: "error",
            message:
                error.message ||
                "Failed to generate AI response",
        });
    }
};

const generateProjectSummary = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate("organization");

        if (!project) {
            return res.status(404).json({
                status: "error",
                message: "Project not found",
            });
        }

        const organization = project.organization;

        const userId = req.user.id.toString();

        const isOwner =
            organization.owner.toString() === userId;

        const isMember =
            organization.members.some(
                (member) =>
                    member.toString() === userId
            );

        if (!isOwner && !isMember) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not a member of this organization",
            });
        }

        const projectContext =
            await getProjectContext(projectId);

        const summary =
            await generateProjectAnswer({
                question: `
                    Provide a concise project summary.

                    Include:
                    1. What the project is about
                    2. Current progress
                    3. Task completion status
                    4. Important pending work
                    5. Recent project activity
                    6. Potential risks or blockers

                    Keep the response structured and concise.
                `,
                context: projectContext,
            });

        return res.status(200).json({
            status: "success",
            summary,
        });

    } catch (error) {
        console.error(
            "PROJECT SUMMARY ERROR:",
            error
        );

        return res.status(500).json({
            status: "error",
            message:
                error.message ||
                "Failed to generate project summary",
        });
    }
};


const askTaskAI = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                status: "error",
                message: "Question is required",
            });
        }

        const task = await Task.findById(taskId)
            .populate("project");

        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found",
            });
        }

        const project = await Project.findById(
            task.project._id
        ).populate("organization");

        if (!project) {
            return res.status(404).json({
                status: "error",
                message: "Project not found",
            });
        }

        const organization =
            project.organization;

        const userId =
            req.user.id.toString();

        const isOwner =
            organization.owner.toString() === userId;

        const isMember =
            organization.members.some(
                (member) =>
                    member.toString() === userId
            );

        if (!isOwner && !isMember) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not a member of this organization",
            });
        }

        const projectContext =
            await getProjectContext(
                project._id
            );

        const answer =
            await generateTaskHelp({
                question:
                    question.trim(),

                task,

                projectContext,
            });
        
            console.log("TASK AI RESPONSE:", answer);
        return res.status(200).json({
            status: "success",
            question:
                question.trim(),
            answer,
        });

    } catch (error) {
        console.error(
            "TASK AI CONTROLLER ERROR:",
            error
        );

        return res.status(500).json({
            status: "error",
            message:
                error.message ||
                "Failed to generate task AI response",
        });
    }
};

const generateTasksForProject = async (
    req,
    res
) => {
    try {
        const { projectId } =
            req.params;

        const { requirement } =
            req.body;

        if (
            !requirement ||
            !requirement.trim()
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "Requirement is required",
            });
        }

        const project =
            await Project.findById(
                projectId
            ).populate(
                "organization"
            );

        if (!project) {
            return res.status(404).json({
                status: "error",
                message:
                    "Project not found",
            });
        }

        const organization =
            project.organization;

        const userId =
            req.user.id.toString();

        const isOwner =
            organization.owner.toString() ===
            userId;

        const isMember =
            organization.members.some(
                (member) =>
                    member.toString() ===
                    userId
            );

        if (
            !isOwner &&
            !isMember
        ) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not a member of this organization",
            });
        }

        const projectContext =
            await getProjectContext(
                projectId
            );

        const tasks =
            await generateProjectTasks({
                requirement:
                    requirement.trim(),

                projectContext,
            });

        return res.status(200).json({
            status: "success",
            tasks,
        });

    } catch (error) {
        console.error(
            "AI TASK GENERATION CONTROLLER ERROR:",
            error
        );

        return res.status(500).json({
            status: "error",
            message:
                error.message ||
                "Failed to generate tasks",
        });
    }
};

export {
    getProjectContextController,
    askProjectAI,
    generateProjectSummary,
    askTaskAI,
    generateTasksForProject
};