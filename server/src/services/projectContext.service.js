import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import Comment from "../models/comment.model.js";
import Activity from "../models/activity.model.js";
import Message from "../models/message.model.js";
import Attachment from "../models/attachment.model.js";

import buildProjectContext from "../utils/buildProjectContext.js";


const getProjectContext = async (projectId) => {

    // -----------------------------
    // PROJECT
    // -----------------------------

    const project = await Project.findById(
        projectId
    )
        .populate(
            "createdBy",
            "name email"
        )
        .populate({
            path: "organization",

            select:
                "name description owner members",

            populate: [
                {
                    path: "owner",

                    select:
                        "name email",
                },

                {
                    path: "members",

                    select:
                        "name email",
                },
            ],
        });


    if (!project) {
        throw new Error(
            "Project not found"
        );
    }


    // -----------------------------
    // TASKS
    // -----------------------------

    const tasks =
        await Task.find({
            project: projectId,
        })
            .populate(
                "assignedTo",
                "name email"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .sort({
                createdAt: -1,
            });


    const taskIds =
        tasks.map(
            (task) =>
                task._id
        );


    // -----------------------------
    // COMMENTS
    // -----------------------------

    const comments =
        await Comment.find({
            task: {
                $in: taskIds,
            },
        })
            .populate(
                "user",
                "name email"
            )
            .populate(
                "task",
                "title"
            )
            .sort({
                createdAt: -1,
            });


    // -----------------------------
    // ATTACHMENTS
    // -----------------------------

    const attachments =
        await Attachment.find({
            task: {
                $in: taskIds,
            },
        })
            .populate(
                "uploadedBy",
                "name email"
            )
            .populate(
                "task",
                "title"
            )
            .sort({
                createdAt: -1,
            });


    // -----------------------------
    // ACTIVITIES
    // -----------------------------

    const activities =
        await Activity.find({
            project: projectId,
        })
            .populate(
                "user",
                "name email"
            )
            .populate(
                "task",
                "title"
            )
            .sort({
                createdAt: -1,
            });


    // -----------------------------
    // CHAT MESSAGES
    // -----------------------------

    const messages =
        await Message.find({
            project: projectId,
        })
            .populate(
                "sender",
                "name email"
            )
            .sort({
                createdAt: -1,
            });


    // -----------------------------
    // BUILD AI CONTEXT
    // -----------------------------

    const context =
        buildProjectContext({
            project,

            organization:
                project.organization,

            tasks,

            comments,

            attachments,

            activities,

            messages,
        });


    return context;
};


export default getProjectContext;