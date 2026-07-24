"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectById } from "@/services/project.service";
import {
    getTasksByProjectId,
    createTask,
    updateTaskStatus,
    deleteTask,
} from "@/services/task.service";

import {
    getCommentsByTaskId,
    createComment,
    updateComment,
    deleteComment,
} from "@/services/comment.service";

import { getMembersOfOrganization } from "@/services/organization.service";
import Link from "next/link";

export default function ProjectDetailsPage() {
    const params = useParams();

    const projectId = params.projectId as string;
    const organizationId = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);

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
                membersResponse
            ] = await Promise.all([
                getTasksByProjectId(projectId),
                getMembersOfOrganization(
                    currentProject.organization
                ),
            ]);

            setTasks(tasksResponse.tasks || []);
            setMembers(
                membersResponse.members || []
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
                Project not found
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

                {/* Activity */}
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold">
                        Activity
                    </h2>

                    <p className="mt-2 text-gray-400">
                        Activity will appear here.
                    </p>
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
                        Chat
                    </h2>

                    <p className="mt-2 text-gray-400">
                        Real-time chat will appear here.
                    </p>
                </div>

            </div>
        </div>
    );
}