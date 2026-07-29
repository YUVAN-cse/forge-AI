"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectById } from "@/services/project.service";
import ProjectRepositoryList from "@/components/github/ProjectRepositoryList";

import { askProjectAI } from "@/services/ai.service";
import GithubRepositoryList from "@/components/github/GithubRepositoryList";

import {
    getTasksByProjectId,
    createTask,
    updateTaskStatus,
    deleteTask,
} from "@/services/task.service";

import ConnectGithubButton from "@/components/github/ConnectGithubButton";
import { getGithubAccount } from "@/services/github.service";

import socket from "@/lib/socket";

import {
    getMessagesByProjectId,
} from "@/services/message.service";

import { getProjectActivity } from "@/services/activity.service";
import {getProjectSummary} from "@/services/ai.service";

import {
    getCommentsByTaskId,
    createComment,
    updateComment,
    deleteComment,
} from "@/services/comment.service";

import {
    generateProjectTasks,
} from "@/services/ai.service";

import { getMembersOfOrganization } from "@/services/organization.service";
import Link from "next/link";

export default function ProjectDetailsPage() {
    const params = useParams();

    const projectId = params.projectId as string;
    const organizationId = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    const [selectedGeneratedTasks, setSelectedGeneratedTasks] =
    useState<number[]>([]);

    const [projectSummary, setProjectSummary] =
    useState("");

    const [loadingSummary, setLoadingSummary] =
        useState(false);

    const [summaryError, setSummaryError] =
        useState("");
    

    const [taskRequirement, setTaskRequirement] =
    useState("");

    const [generatedTasks, setGeneratedTasks] =
        useState<any[]>([]);


    const [generatingTasks, setGeneratingTasks] =
        useState(false);

    const [taskGenerationError, setTaskGenerationError] =
        useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [creatingTask, setCreatingTask] = useState(false);
    const [error, setError] = useState("");

    const [members, setMembers] = useState<any[]>([]);
    const [assignedTo, setAssignedTo] = useState("");   

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentContent, setCommentContent] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [creatingComment, setCreatingComment] = useState(false);

    const [editingComment, setEditingComment] = useState<any>(null);
    const [editContent, setEditContent] = useState("");
    const [updatingComment, setUpdatingComment] = useState(false);
    const [deletingComment, setDeletingComment] = useState<string | null>(null);

    const [messages, setMessages] = useState<any[]>([]);
    const [messageContent, setMessageContent] = useState("");   

    const [activities, setActivities] = useState<any[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(false);

    const [aiQuestion, setAiQuestion] = useState("");
    const [aiAnswer, setAiAnswer] = useState("");
    const [askingAI, setAskingAI] = useState(false);
    const [aiError, setAiError] = useState("");


    const [githubConnected, setGithubConnected] = useState(false);
    const [githubUsername, setGithubUsername] = useState("");
    const [checkingGithub, setCheckingGithub] = useState(true);


    const fetchProject = async () => {
        try {
            const response =
                await getProjectById(projectId);

            setProject(response.project);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch project"
            );
        }
    };

    const checkGithubConnection = async () => {
    try {
        setCheckingGithub(true);

        const response = await getGithubAccount();

        if (response.connected) {
            setGithubConnected(true);
            setGithubUsername(
                response.account?.username || ""
            );
        } else {
            setGithubConnected(false);
        }

    } catch (error: any) {
        console.error(
            "Failed to check GitHub connection:",
            error
        );

        setGithubConnected(false);

    } finally {
        setCheckingGithub(false);
    }
};
    

    const toggleGeneratedTask = (index: number) => {
    setSelectedGeneratedTasks((prev) => {
        if (prev.includes(index)) {
            return prev.filter((item) => item !== index);
        }

        return [...prev, index];
    });
};

const handleCreateSelectedTasks = async () => {
    if (selectedGeneratedTasks.length === 0) {
        return;
    }

    try {
        setLoading(true);

        const tasksToCreate =
            generatedTasks.filter((_, index) =>
                selectedGeneratedTasks.includes(index)
            );

        for (const task of tasksToCreate) {
            await createTask(
                projectId,
                task.title,
                task.description,
                undefined,
                task.priority
            );
        }

        const response =
            await getTasksByProjectId(projectId);

        setTasks(
            response.tasks || []
        );

        setGeneratedTasks([]);
        setSelectedGeneratedTasks([]);
        setTaskRequirement("");

    } catch (error) {
        console.error(
            "Failed to create generated tasks:",
            error
        );
    } finally {
        setLoading(false);
    }
};


    const handleGenerateTasks = async () => {
    if (!taskRequirement.trim()) {
        return;
    }

    try {
        setGeneratingTasks(true);
        setTaskGenerationError("");
        setGeneratedTasks([]);

        const response =
            await generateProjectTasks(
                projectId,
                taskRequirement.trim()
            );

        setGeneratedTasks(
            response.tasks || []
        );

    } catch (error: any) {
        console.error(
            "Task Generation Error:",
            error
        );

        setTaskGenerationError(
            error.response?.data?.message ||
            "Failed to generate tasks"
        );
    } finally {
        setGeneratingTasks(false);
    }
};

    const handleGenerateSummary = async () => {
    try {
        setLoadingSummary(true);
        setSummaryError("");

        const response =
            await getProjectSummary(projectId);

        setProjectSummary(
            response.summary || ""
        );

    } catch (error: any) {
        console.error(
            "Project Summary Error:",
            error
        );

        setSummaryError(
            error.response?.data?.message ||
            "Failed to generate project summary"
        );
    } finally {
        setLoadingSummary(false);
    }
};

    const fetchProjectActivity = async () => {
        try {
            setLoadingActivities(true);

            const response =
                await getProjectActivity(projectId);

            setActivities(
                response.activities || []
            );

        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch project activity"
            );
        } finally {
            setLoadingActivities(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const response =
                await getTasksByProjectId(projectId);

            setTasks(response.tasks || []);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch tasks"
            );
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await getMembersOfOrganization(
                project.organization._id
            );

            setMembers(response.members || []);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch members"
            );
        }
    };

    const handleOpenComments = async (task: any) => {
        try {
            setSelectedTask(task);
            setLoadingComments(true);
            setError("");

            const response =
                await getCommentsByTaskId(task._id);

            setComments(response.comments || []);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch comments"
            );
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCreateComment = async () => {
            if (!commentContent.trim() || !selectedTask) {
                return;
            }

            try {
                setCreatingComment(true);
                setError("");

                const response =
                    await createComment(
                        selectedTask._id,
                        commentContent
                    );

                setComments((prev) => [
                    response.comment,
                    ...prev,
                ]);

                setCommentContent("");
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to create comment"
                );
            } finally {
                setCreatingComment(false);
            }
        };

        const handleUpdateComment = async () => {
            if (!editingComment || !editContent.trim()) {
                return;
            }

            try {
                setUpdatingComment(true);
                setError("");

                const response = await updateComment(
                    editingComment._id,
                    editContent
                );

                setComments((prev) =>
                    prev.map((comment) =>
                        comment._id === editingComment._id
                            ? {
                                ...comment,
                                content: response.comment.content,
                            }
                            : comment
                    )
                );

                setEditingComment(null);
                setEditContent("");
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to update comment"
                );
            } finally {
                setUpdatingComment(false);
            }
        };

        const handleDeleteComment = async (
                commentId: string
            ) => {
                try {
                    setDeletingComment(commentId);
                    setError("");

                    await deleteComment(commentId);

                    setComments((prev) =>
                        prev.filter(
                            (comment) => comment._id !== commentId
                        )
                    );
                } catch (error: any) {
                    setError(
                        error.response?.data?.message ||
                        "Failed to delete comment"
                    );
                } finally {
                    setDeletingComment(null);
                }
            };

            const handleSendMessage = () => {
    if (!messageContent.trim()) {
        return;
    }

    if (!socket.connected) {
        console.error(
            "Socket is not connected"
        );
        return;
    }

    socket.emit(
        "send_message",
        {
            projectId,
            content: messageContent.trim(),
        }
    );

    setMessageContent("");
};

const handleDeleteMessage = (
    messageId: string
) => {
    socket.emit(
        "delete_message",
        {
            messageId,
        }
    );
};

const handleAskAI = async () => {
    if (!aiQuestion.trim()) {
        return;
    }

    try {
        setAskingAI(true);
        setAiError("");
        setAiAnswer("");

        const response = await askProjectAI(
            projectId,
            aiQuestion.trim()
        );

        setAiAnswer(
            response.answer || "No answer received."
        );

        setAiQuestion("");

    } catch (error: any) {
        console.error(
            "AI Assistant Error:",
            error
        );

        setAiError(
            error.response?.data?.message ||
            "Failed to get AI response"
        );
    } finally {
        setAskingAI(false);
    }
};


useEffect(() => {
    checkGithubConnection();
}, []);

    useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const projectResponse =
                await getProjectById(projectId);

            const currentProject =
                projectResponse.project;

            setProject(currentProject);

            const [
                tasksResponse,
                membersResponse,
                activityResponse
            ] = await Promise.all([
                getTasksByProjectId(projectId),
                getMembersOfOrganization(
                    currentProject.organization
                ),
                getProjectActivity(projectId),
            ]);

            setTasks(tasksResponse.tasks || []);

            setMembers(
                membersResponse.members || []
            );

            setActivities(
                activityResponse.activities || []
            );


            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load project"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);


    useEffect(() => {
    if (!projectId) {
        return;
    }

    const initializeChat = async () => {
        try {
            // Get old messages
            const response =
                await getMessagesByProjectId(
                    projectId
                );

            setMessages(
                response.data || []
            );

            // Get JWT
            const token =
                localStorage.getItem(
                    "token"
                );

            if (!token) {
                console.error(
                    "Authentication token not found"
                );
                return;
            }

            // Give JWT to Socket.IO
            socket.auth = {
                token,
            };

            // Connect
            socket.connect();

            // Join project room
            socket.emit(
                "join_project",
                projectId
            );


            

        } catch (error: any) {
            console.error(
                error.response?.data?.message ||
                "Failed to initialize chat"
            );
        }
    };

    const handleReceiveMessage = (
        message: any
    ) => {
        setMessages((prev) => [
            ...prev,
            message,
        ]);
    };

    const handleMessageDeleted = (
        data: any
    ) => {
        setMessages((prev) =>
            prev.filter(
                (message) =>
                    message._id !==
                    data.messageId
            )
        );
    };

    const handleJoinError = (
        data: any
    ) => {
        console.error(
            "Failed to join project:",
            data.message
        );
    };

    const handleDeleteMessageError = (
    data: any
) => {
    console.error(
        "Delete message error:",
        data.message
    );
};

socket.on(
    "receive_message",
    handleReceiveMessage
);

socket.on(
    "message_deleted",
    handleMessageDeleted
);

socket.on(
    "join_project_error",
    handleJoinError
);

socket.on(
    "delete_message_error",
    handleDeleteMessageError
);


initializeChat();

    return () => {
    socket.off(
        "receive_message",
        handleReceiveMessage
    );

    socket.off(
        "message_deleted",
        handleMessageDeleted
    );

    socket.off(
        "join_project_error",
        handleJoinError
    );

    socket.off(
        "delete_message_error",
        handleDeleteMessageError
    );

    socket.disconnect();
};

}, [projectId]);

    const handleCreateTask = async () => {
            if (
                !taskTitle.trim() ||
                !taskDescription.trim()
            ) {
                return;
            }

            try {
                setCreatingTask(true);
                setError("");

                await createTask(
                    projectId,
                    taskTitle,
                    taskDescription,
                    assignedTo || undefined
                );

                setTaskTitle("");
                setTaskDescription("");
                setAssignedTo("");

                await fetchTasks();

            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to create task"
                );
            } finally {
                setCreatingTask(false);
            }
        };

    const handleUpdateStatus = async (
    taskId: string,
    status: string
) => {
    try {
        setError("");

        await updateTaskStatus(
            taskId,
            status
        );

        await fetchTasks();
    } catch (error: any) {
        setError(
            error.response?.data?.message ||
            "Failed to update task status"
        );
    }
};

const handleDeleteTask = async (
    taskId: string
) => {
    try {
        setError("");

        await deleteTask(taskId);

        await fetchTasks();
    } catch (error: any) {
        setError(
            error.response?.data?.message ||
            "Failed to delete task"
        );
    }
};

    if (loading) {
        return (
            <div>
                Loading project...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-400">
                {error}
            </div>
        );
    }

    if (!project) {
        return (
            <div>
                Project doesn't exist
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">
                {project.name}
            </h1>

            <p className="mt-2 text-gray-400">
                {project.description}
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

                {/* Tasks */}
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold">
                        Tasks
                    </h2>

                    {/* Create Task */}
                    <div className="mt-4 space-y-3">
                        <input
                            type="text"
                            placeholder="Task title"
                            value={taskTitle}
                            onChange={(e) =>
                                setTaskTitle(e.target.value)
                            }
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                        />

                        <textarea
                            placeholder="Task description"
                            value={taskDescription}
                            onChange={(e) =>
                                setTaskDescription(e.target.value)
                            }
                            rows={3}
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                        />

                        <select
    value={assignedTo}
    onChange={(e) =>
        setAssignedTo(e.target.value)
    }
    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
>
    <option value="">
        Assign to...
    </option>

    {members.map((member: any) => (
        <option
            key={member._id}
            value={member._id}
        >
            {member.name} ({member.email})
        </option>
    ))}
</select>

                        <button
                            onClick={handleCreateTask}
                            disabled={creatingTask}
                            className="rounded-md bg-white px-4 py-2 text-black disabled:opacity-50"
                        >
                            {creatingTask
                                ? "Creating..."
                                : "Create Task"}
                        </button>
                    </div>

                    {/* Task List */}
                    <div className="mt-6 space-y-3">
                        {tasks.length === 0 ? (
                            <p className="text-gray-400">
                                No tasks yet.
                            </p>
                        ) : (
                            tasks.map((task: any) => (
    <Link
        key={task._id}
        href={`/organizations/${organizationId}/projects/${projectId}/tasks/${task._id}`}
        className="block rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-600"
    >
        <h3 className="text-lg font-semibold">
            {task.title}
        </h3>

        <p className="mt-2 text-sm text-gray-400">
            {task.description}
        </p>

        <div className="mt-3 flex gap-3 text-sm text-gray-400">
            <span>
                Status: {task.status}
            </span>

            <span>
                Priority: {task.priority}
            </span>
        </div>
    </Link>
))
                        )}

                        
                    </div>

                    
                </div>

                    {/* AI Task Generator */}
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">

    <div>
        <h2 className="text-xl font-semibold">
             AI Task Generator
        </h2>

        <p className="mt-1 text-sm text-gray-400">
            Describe a feature and let ForgeAI
            break it into actionable tasks.
        </p>
    </div>

    <textarea
        value={taskRequirement}
        onChange={(e) =>
            setTaskRequirement(e.target.value)
        }
        placeholder="Example: Build JWT authentication with refresh tokens and Google OAuth..."
        rows={4}
        disabled={generatingTasks}
        className="mt-6 w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-3 outline-none disabled:opacity-50"
    />

    <button
        onClick={handleGenerateTasks}
        disabled={
            generatingTasks ||
            !taskRequirement.trim()
        }
        className="mt-4 rounded-md bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
    >
        {generatingTasks
            ? "Generating..."
            : "Generate Tasks"}
    </button>

    {taskGenerationError && (
        <div className="mt-4 rounded-md border border-red-900 bg-red-950 p-3">
            <p className="text-sm text-red-400">
                {taskGenerationError}
            </p>
        </div>
    )}

    {generatedTasks.length > 0 && (
        <div className="mt-6 space-y-4">

            <h3 className="font-medium">
                Generated Tasks
            </h3>

            {generatedTasks.map(
    (task, index) => {
        const isSelected =
            selectedGeneratedTasks.includes(index);

        return (
            <div
                key={index}
                onClick={() =>
                    toggleGeneratedTask(index)
                }
                className={`cursor-pointer rounded-md border p-4 transition ${
                    isSelected
                        ? "border-white bg-gray-800"
                        : "border-gray-800 bg-gray-950"
                }`}
            >
                <div className="flex items-start gap-3">

                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                            toggleGeneratedTask(index)
                        }
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    />

                    <div className="flex-1">

                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                                {task.title}
                            </h4>

                            <span className="text-xs text-gray-400">
                                {task.priority}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-400">
                            {task.description}
                        </p>

                    </div>

                </div>
            </div>
        );
    }
)}

{generatedTasks.length > 0 && (
    <button
        onClick={
            handleCreateSelectedTasks
        }
        disabled={
            selectedGeneratedTasks.length === 0 ||
            loading
        }
        className="mt-6 rounded-md bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
    >
        {loading
            ? "Creating Tasks..."
            : `Create Selected Tasks (${selectedGeneratedTasks.length})`}
    </button>
)}

        </div>
    )}

                    </div>

                    {/* GitHub Integration */}
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">

                        <h2 className="text-xl font-semibold">
                            GitHub Integration
                        </h2>

                        {checkingGithub ? (

                            <p className="mt-2 text-sm text-gray-400">
                                Checking GitHub connection...
                            </p>

                        ) : githubConnected ? (

                            <div>

                                <p className="mt-2 text-sm text-gray-400">
                                    Your GitHub account is connected to ForgeAI.
                                </p>

                                {githubUsername && (
                                    <p className="mt-3 text-sm text-gray-300">
                                        Connected as{" "}
                                        <span className="font-medium text-white">
                                            @{githubUsername}
                                        </span>
                                    </p>
                                )}

                                <div className="mt-5">
                                    <div className="inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300">
                                        GitHub Connected ✓
                                    </div>
                                </div>

                            </div>

                        ) : (

                            <div>

                                <p className="mt-2 text-sm text-gray-400">
                                    Connect your GitHub account to import and
                                    analyze repositories.
                                </p>

                                <div className="mt-5">
                                    <ConnectGithubButton />
                                </div>

                            </div>

                        )}

                    </div>

                    {/* GitHub Repositories */}
                    <div className="mt-8 rounded-xl border p-6">

                        <h2 className="text-2xl font-semibold">
                            GitHub Repositories
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Import a GitHub repository into this project.
                        </p>

                        <div className="mt-6 ">
                            <GithubRepositoryList
                                projectId={projectId}
                            />

                            <h2 className="mt-10 text-xl font-semibold">
                                Connected Repositories
                            </h2>

                            <ProjectRepositoryList
                                projectId={projectId}
                                organizationId={organizationId}
                            />
                        </div>

                    </div>

                    {/* Activity */}
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 h-125 flex flex-col">
                        <h2 className="text-xl font-semibold">
                            Activity
                        </h2>

                        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-2">
                            {activities.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    No activity yet.
                                </p>
                            ) : (
                                activities.map((activity: any) => (
                                    <div
                                        key={activity._id}
                                        className="rounded-md border border-gray-800 bg-gray-950 p-3"
                                    >
                                        <p className="text-sm text-gray-300">
                                            <span className="font-medium text-white">
                                                {activity.user?.name || "Unknown User"}
                                            </span>{" "}
                                            {activity.action
                                                ?.toLowerCase()
                                                .replaceAll("_", " ")}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {new Date(
                                                activity.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* AI Assistant */}
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    ForgeAI Assistant
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Ask questions about your project.
                                </p>
                            </div>
                        </div>

                        {/* Question Input */}
                        <div className="mt-6 flex gap-2">
                            <input
                                type="text"
                                value={aiQuestion}
                                onChange={(e) =>
                                    setAiQuestion(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        !e.shiftKey
                                    ) {
                                        e.preventDefault();

                                        handleAskAI();
                                    }
                                }}
                                placeholder="Ask something about this project..."
                                disabled={askingAI}
                                className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none disabled:opacity-50"
                            />

                            <button
                                onClick={handleAskAI}
                                disabled={
                                    askingAI ||
                                    !aiQuestion.trim()
                                }
                                className="rounded-md bg-white px-4 py-2 text-black disabled:opacity-50"
                            >
                                {askingAI
                                    ? "Thinking..."
                                    : "Ask"}
                            </button>
                        </div>

                        {/* Error */}
                        {aiError && (
                            <div className="mt-4 rounded-md border border-red-900 bg-red-950 p-3">
                                <p className="text-sm text-red-400">
                                    {aiError}
                                </p>
                            </div>
                        )}

                        {/* Answer */}
                        {aiAnswer && (
                            <div className="mt-6 rounded-md border border-gray-800 bg-gray-950 p-4">
                                <p className="text-sm font-medium text-gray-400">
                                    ForgeAI
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-200">
                                    {aiAnswer}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* AI Project Summary */}
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">

                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    AI Project Summary
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Get an AI-generated overview of your project.
                                </p>
                            </div>

                            <button
                                onClick={handleGenerateSummary}
                                disabled={loadingSummary}
                                className="rounded-md bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
                            >
                                {loadingSummary
                                    ? "Analyzing..."
                                    : "Generate Summary"}
                            </button>
                        </div>

                        {summaryError && (
                            <div className="mt-4 rounded-md border border-red-900 bg-red-950 p-3">
                                <p className="text-sm text-red-400">
                                    {summaryError}
                                </p>
                            </div>
                        )}

                        {projectSummary && (
                            <div className="mt-6 rounded-md border border-gray-800 bg-gray-950 p-4">
                                <p className="text-sm font-medium text-gray-400">
                                    ForgeAI Project Analysis
                                </p>

                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-200">
                                    {projectSummary}
                                </p>
                            </div>
                        )}

                    </div>

                                    {/* Comments */}
                                    {selectedTask && (
                        <div className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
                            <h2 className="text-xl font-semibold">
                                Comments — {selectedTask.title}
                            </h2>

                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={commentContent}
                                    onChange={(e) =>
                                        setCommentContent(e.target.value)
                                    }
                                    className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                                />

                                <button
                                    onClick={handleCreateComment}
                                    disabled={creatingComment}
                                    className="rounded-md bg-white px-4 py-2 text-black disabled:opacity-50"
                                >
                                    {creatingComment
                                        ? "Adding..."
                                        : "Comment"}
                                </button>
                            </div>

                            <div className="mt-6 space-y-3">
                                {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="rounded-md border border-gray-800 bg-gray-800 p-4"
                        >
                            {editingComment?._id === comment._id ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 outline-none"
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdateComment}
                                            disabled={updatingComment}
                                            className="rounded-md bg-white px-3 py-2 text-sm text-black disabled:opacity-50"
                                        >
                                            {updatingComment
                                                ? "Saving..."
                                                : "Save"}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingComment(null);
                                                setEditContent("");
                                            }}
                                            className="rounded-md border border-gray-700 px-3 py-2 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="font-medium">
                                        {comment.user?.name}
                                    </p>

                                    <p className="mt-1 text-gray-300">
                                        {comment.content}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-500">
                                        {new Date(
                                            comment.createdAt
                                        ).toLocaleString()}
                                    </p>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingComment(comment);
                                                setEditContent(comment.content);
                                            }}
                                            className="text-sm text-gray-400 hover:text-white"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteComment(comment._id)
                                            }
                                            disabled={
                                                deletingComment === comment._id
                                            }
                                            className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                                        >
                                            {deletingComment === comment._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                            </div>
                        </div>
                    )}



                                {/* Chat */}
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold">
                        Project Chat
                    </h2>

                    {/* Messages */}
                    <div className="mt-6 h-96 space-y-4 overflow-y-auto rounded-md border border-gray-800 bg-gray-950 p-4">

                        {messages.length === 0 ? (
                            <p className="text-sm text-gray-400">
                                No messages yet.
                            </p>
                        ) : (
                            messages.map(
                                (message: any) => (
                                    <div
                                        key={message._id}
                                        className="flex items-start justify-between gap-4 rounded-md bg-gray-900 p-3"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {message.sender?.name ||
                                                    "Unknown User"}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-300">
                                                {message.content}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {new Date(
                                                    message.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteMessage(
                                                            message._id
                                                        )
                                                    }
                                                    className="text-sm text-red-400 hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                        
                                    </div>
                                )
                            )
                        )}

                    </div>

                    {/* Send Message */}
                    <div className="mt-4 flex gap-2">

                        <input
                            type="text"
                            value={messageContent}
                            onChange={(e) =>
                                setMessageContent(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    !e.shiftKey
                                ) {
                                    e.preventDefault();

                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                        />

                        <button
                            onClick={handleSendMessage}
                            disabled={
                                !messageContent.trim()
                            }
                            className="rounded-md bg-white px-4 py-2 text-black disabled:opacity-50"
                        >
                            Send
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
}