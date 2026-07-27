const buildProjectContext = (data) => {
    const {
        project,
        organization,
        tasks = [],
        comments = [],
        attachments = [],
        activities = [],
        messages = [],
    } = data;

    // -----------------------------
    // TASK STATISTICS
    // -----------------------------

    const taskStats = {
        total: tasks.length,

        todo: tasks.filter(
            (task) => task.status === "TODO"
        ).length,

        inProgress: tasks.filter(
            (task) => task.status === "IN_PROGRESS"
        ).length,

        done: tasks.filter(
            (task) => task.status === "DONE"
        ).length,

        highPriority: tasks.filter(
            (task) => task.priority === "HIGH"
        ).length,

        mediumPriority: tasks.filter(
            (task) => task.priority === "MEDIUM"
        ).length,

        lowPriority: tasks.filter(
            (task) => task.priority === "LOW"
        ).length,
    };


    // -----------------------------
    // TASKS
    // -----------------------------

    const formattedTasks = tasks.map((task) => ({
        id: task._id,

        title: task.title,

        description: task.description,

        status: task.status,

        priority: task.priority,

        assignedTo: task.assignedTo
            ? {
                name: task.assignedTo.name,
                email: task.assignedTo.email,
            }
            : null,

        createdBy: task.createdBy
            ? {
                name: task.createdBy.name,
                email: task.createdBy.email,
            }
            : null,

        dueDate: task.dueDate || null,

        createdAt: task.createdAt,
    }));


    // -----------------------------
    // COMMENTS
    // -----------------------------

    const formattedComments = comments.map(
        (comment) => ({
            task: comment.task
                ? comment.task.title
                : "Unknown Task",

            user: comment.user
                ? comment.user.name
                : "Unknown User",

            content: comment.content,

            createdAt: comment.createdAt,
        })
    );


    // -----------------------------
    // ATTACHMENTS
    // -----------------------------

    const formattedAttachments =
        attachments.map(
            (attachment) => ({
                task: attachment.task
                    ? attachment.task.title
                    : "Unknown Task",

                fileName:
                    attachment.fileName,

                fileType:
                    attachment.fileType,

                fileSize:
                    attachment.fileSize,

                uploadedBy:
                    attachment.uploadedBy
                        ? attachment.uploadedBy.name
                        : "Unknown User",

                createdAt:
                    attachment.createdAt,
            })
        );


    // -----------------------------
    // ACTIVITIES
    // -----------------------------

    const formattedActivities =
        activities.map(
            (activity) => ({
                action:
                    activity.action,

                user:
                    activity.user
                        ? activity.user.name
                        : "Unknown User",

                task:
                    activity.task
                        ? activity.task.title
                        : null,

                metadata:
                    activity.metadata || null,

                createdAt:
                    activity.createdAt,
            })
        );


    // -----------------------------
    // CHAT MESSAGES
    // -----------------------------

    const formattedMessages =
        messages.map(
            (message) => ({
                sender:
                    message.sender
                        ? message.sender.name
                        : "Unknown User",

                content:
                    message.content,

                createdAt:
                    message.createdAt,
            })
        );


    // -----------------------------
    // FINAL AI CONTEXT
    // -----------------------------

    return {
        project: {
            name:
                project?.name,

            description:
                project?.description,

            status:
                project?.status,

            createdBy:
                project?.createdBy?.name,

            createdAt:
                project?.createdAt,
        },

        organization: {
            name:
                organization?.name,

            description:
                organization?.description,

            owner:
                organization?.owner?.name,

            members:
                organization?.members?.map(
                    (member) => ({
                        name: member.name,
                        email: member.email,
                    })
                ) || [],
        },

        taskStats,

        tasks: formattedTasks,

        comments: formattedComments,

        attachments: formattedAttachments,

        activities: formattedActivities,

        messages: formattedMessages,
    };
};

export default buildProjectContext;