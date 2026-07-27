const selectProjectContext = (
    question,
    context
) => {

    if (!question) {
        return context;
    }

    const normalizedQuestion =
        question.toLowerCase();


    // --------------------------------
    // KEYWORD GROUPS
    // --------------------------------

    const taskKeywords = [
        "task",
        "tasks",
        "todo",
        "to-do",
        "pending",
        "completed",
        "done",
        "progress",
        "status",
        "priority",
        "deadline",
        "due",
        "assigned",
        "assignment",
    ];


    const commentKeywords = [
        "comment",
        "comments",
        "feedback",
        "discussed",
        "discussion",
        "opinion",
    ];


    const messageKeywords = [
        "chat",
        "message",
        "messages",
        "conversation",
        "talked",
        "said",
        "discuss",
        "discussed",
    ];


    const activityKeywords = [
        "activity",
        "activities",
        "history",
        "recent changes",
        "what happened",
        "changes",
        "updated",
        "created",
        "deleted",
    ];


    const attachmentKeywords = [
        "file",
        "files",
        "attachment",
        "attachments",
        "document",
        "documents",
        "uploaded",
    ];


    const memberKeywords = [
        "member",
        "members",
        "team",
        "team members",
        "developer",
        "developers",
        "who is working",
        "people",
    ];


    const projectKeywords = [
        "project",
        "project summary",
        "overview",
        "about the project",
    ];


    // --------------------------------
    // MATCH KEYWORDS
    // --------------------------------

    const hasKeyword = (
        keywords
    ) => {
        return keywords.some(
            (keyword) =>
                normalizedQuestion.includes(
                    keyword
                )
        );
    };


    const needsTasks =
        hasKeyword(taskKeywords);

    const needsComments =
        hasKeyword(commentKeywords);

    const needsMessages =
        hasKeyword(messageKeywords);

    const needsActivities =
        hasKeyword(activityKeywords);

    const needsAttachments =
        hasKeyword(attachmentKeywords);

    const needsMembers =
        hasKeyword(memberKeywords);

    const needsProject =
        hasKeyword(projectKeywords);


    // --------------------------------
    // GENERAL QUESTIONS
    // --------------------------------

    const isGeneralQuestion =
        !needsTasks &&
        !needsComments &&
        !needsMessages &&
        !needsActivities &&
        !needsAttachments &&
        !needsMembers;


    // --------------------------------
    // BUILD SELECTED CONTEXT
    // --------------------------------

    const selectedContext = {

        project:
            context.project,

        organization:
            needsMembers ||
            isGeneralQuestion
                ? context.organization
                : undefined,

        taskStats:
            needsTasks ||
            isGeneralQuestion
                ? context.taskStats
                : undefined,

        tasks:
            needsTasks ||
            isGeneralQuestion
                ? context.tasks
                : undefined,

        comments:
            needsComments ||
            isGeneralQuestion
                ? context.comments
                : undefined,

        attachments:
            needsAttachments ||
            isGeneralQuestion
                ? context.attachments
                : undefined,

        activities:
            needsActivities ||
            isGeneralQuestion
                ? context.activities
                : undefined,

        messages:
            needsMessages ||
            isGeneralQuestion
                ? context.messages
                : undefined,
    };


    return selectedContext;
};


export default selectProjectContext;