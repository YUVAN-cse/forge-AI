"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


import { getTaskById  , updateTask} from "@/services/task.service";

import {
    createAttachment,
    getAttachmentsByTaskId,
    deleteAttachment,
} from "@/services/attachment.service";

import {
    getCommentsByTaskId,
    createComment,
    updateComment,
    deleteComment,
} from "@/services/comment.service";

import {
    getActivityByTaskId,
} from "@/services/activity.service";

export default function TaskDetailsPage() {
    const params = useParams();

    const projectId = params.projectId as string;
    const taskId = params.tasksId as string;
    const organizationId = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [task, setTask] = useState<any>(null);
    const [editingTask, setEditingTask] = useState(false);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editPriority, setEditPriority] = useState("");
    const [editDueDate, setEditDueDate] = useState("");

    const [updatingTask, setUpdatingTask] = useState(false);

    const [attachments, setAttachments] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deletingAttachment, setDeletingAttachment] = useState<string | null>(null);

    const [comments, setComments] = useState<any[]>([]);
    const [commentContent, setCommentContent] = useState("");
    const [creatingComment, setCreatingComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");
    const [updatingComment, setUpdatingComment] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

    const [activities, setActivities] = useState<any[]>([]);

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const taskResponse =
                    await getTaskById(taskId);

                setTask(taskResponse.task);

                const attachmentResponse =
                    await getAttachmentsByTaskId(taskId);

                setAttachments(
                    attachmentResponse.attachments || []
                );
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load task"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchComments();
        fetchActivities();
    }, [projectId, taskId]);


    const handleDeleteAttachment = async (
        attachmentId: string
    ) => {
        try {
            setDeletingAttachment(attachmentId);
            setError("");

            await deleteAttachment(attachmentId);

            setAttachments((prev) =>
                prev.filter(
                    (attachment) =>
                        attachment._id !== attachmentId
                )
            );
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to delete attachment"
            );
        } finally {
            setDeletingAttachment(null);
        }
    };

    

    const fetchActivities = async () => {
        try {
            const response =
                await getActivityByTaskId(taskId);

            setActivities(response.activities || []);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch activities"
            );
        }
    };

    const handleCreateComment = async () => {
    if (!commentContent.trim()) {
        return;
    }

    try {
        setCreatingComment(true);
        setError("");

        await createComment(
            taskId,
            commentContent
        );

        setCommentContent("");

        await fetchComments();
    } catch (error: any) {
        setError(
            error.response?.data?.message ||
            "Failed to create comment"
        );
    } finally {
        setCreatingComment(false);
    }
};

const handleUpdateComment = async (
    commentId: string
) => {
    if (!editingCommentContent.trim()) {
        return;
    }

    try {
        setUpdatingComment(true);
        setError("");

        await updateComment(
            commentId,
            editingCommentContent
        );

        setEditingCommentId(null);
        setEditingCommentContent("");

        await fetchComments();
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
        setDeletingCommentId(commentId);
        setError("");

        await deleteComment(commentId);

        await fetchComments();
    } catch (error: any) {
        setError(
            error.response?.data?.message ||
            "Failed to delete comment"
        );
    } finally {
        setDeletingCommentId(null);
    }
};

    const fetchComments = async () => {
        try {
            const response =
                await getCommentsByTaskId(taskId);

            setComments(response.comments || []);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch comments"
            );
        }
    };
    const handleEditTask = () => {
        setEditTitle(task.title || "");
        setEditDescription(task.description || "");
        setEditStatus(task.status || "TODO");
        setEditPriority(task.priority || "MEDIUM");

        setEditDueDate(
            task.dueDate
                ? new Date(task.dueDate)
                    .toISOString()
                    .split("T")[0]
                : ""
        );

        setEditingTask(true);
    };

    const handleUpdateTask = async () => {
    try {
        setUpdatingTask(true);
        setError("");

        const response = await updateTask(
                    taskId,
                    {
                        title: editTitle,
                        description: editDescription,
                        status: editStatus,
                        priority: editPriority,
                        dueDate: editDueDate || undefined,
                    }
                );

                setTask(response.task);

                setEditingTask(false);

            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to update task"
                );
            } finally {
                setUpdatingTask(false);
            }
        };

    const handleUploadAttachment = async () => {
    if (!selectedFile) {
        return;
    }

    try {
        setUploading(true);
        setError("");

        await createAttachment(
            taskId,
            selectedFile
        );

        setSelectedFile(null);

        const response =
            await getAttachmentsByTaskId(
                taskId
            );

        setAttachments(
            response.attachments || []
        );

    } catch (error: any) {
        setError(
            error.response?.data?.message ||
            "Failed to upload attachment"
        );
    } finally {
        setUploading(false);
    }
};


    if (loading) {
        return (
            <div className="p-6">
                Loading task...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-400">
                {error}
            </div>
        );
    }

    if (!task) {
        return (
            <div className="p-6">
                Task not found
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Task Header */}

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {task.title}
                    </h1>

                    <p className="mt-2 text-gray-400">
                        {task.description}
                    </p>
                </div>

                <button
                    onClick={handleEditTask}
                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black"
                >
                    Edit Task
                </button>
            </div>

            {editingTask && (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold">
            Edit Task
        </h2>

        <div className="mt-6 space-y-4">

            {/* Title */}

            <div>
                <label className="text-sm text-gray-400">
                    Title
                </label>

                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) =>
                        setEditTitle(e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                />
            </div>

            {/* Description */}

            <div>
                <label className="text-sm text-gray-400">
                    Description
                </label>

                <textarea
                    value={editDescription}
                    onChange={(e) =>
                        setEditDescription(e.target.value)
                    }
                    rows={4}
                    className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                />
            </div>

            {/* Status */}

            <div>
                <label className="text-sm text-gray-400">
                    Status
                </label>

                <select
                    value={editStatus}
                    onChange={(e) =>
                        setEditStatus(e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                >
                    <option value="TODO">
                        TODO
                    </option>

                    <option value="IN_PROGRESS">
                        IN PROGRESS
                    </option>

                    <option value="DONE">
                        DONE
                    </option>
                </select>
            </div>

            {/* Priority */}

            <div>
                <label className="text-sm text-gray-400">
                    Priority
                </label>

                <select
                    value={editPriority}
                    onChange={(e) =>
                        setEditPriority(e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                >
                    <option value="LOW">
                        LOW
                    </option>

                    <option value="MEDIUM">
                        MEDIUM
                    </option>

                    <option value="HIGH">
                        HIGH
                    </option>
                </select>
            </div>

            {/* Due Date */}

            <div>
                <label className="text-sm text-gray-400">
                    Due Date
                </label>

                <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) =>
                        setEditDueDate(e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                />
            </div>

            {/* Buttons */}

            <div className="flex gap-3 pt-2">

                <button
                    onClick={handleUpdateTask}
                    disabled={updatingTask}
                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
                >
                    {updatingTask
                        ? "Saving..."
                        : "Save Changes"}
                </button>

                <button
                    onClick={() =>
                        setEditingTask(false)
                    }
                    disabled={updatingTask}
                    className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white"
                >
                    Cancel
                </button>

            </div>
        </div>
    </div>
)}


            {/* Task Information */}

            <div className="grid gap-4 md:grid-cols-4">

                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">
                        Status
                    </p>

                    <p className="mt-2 font-semibold">
                        {task.status}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">
                        Priority
                    </p>

                    <p className="mt-2 font-semibold">
                        {task.priority}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">
                        Assigned To
                    </p>

                    <p className="mt-2 font-semibold">
                        {task.assignedTo?.name ||
                            "Unassigned"}
                    </p>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <p className="text-sm text-gray-400">
                        Due Date
                    </p>

                    <p className="mt-2 font-semibold">
                        {task.dueDate
                            ? new Date(
                                task.dueDate
                            ).toLocaleDateString()
                            : "No due date"}
                    </p>
                </div>

            </div>


            {/* Attachments */}

            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 className="text-xl font-semibold">
        Attachments
    </h2>

    {/* Upload */}
    <div className="mt-4 flex flex-col gap-3">
        <input
            type="file"
            onChange={(e) => {
                setSelectedFile(
                    e.target.files?.[0] || null
                );
            }}
            className="block w-full text-sm text-gray-400"
        />

        {selectedFile && (
            <p className="text-sm text-gray-400">
                Selected: {selectedFile.name}
            </p>
        )}

        <button
            onClick={handleUploadAttachment}
            disabled={
                !selectedFile ||
                uploading
            }
            className="w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
            {uploading
                ? "Uploading..."
                : "Upload Attachment"}
        </button>
    </div>

    {/* Attachment List */}
    <div className="mt-6 space-y-3">
        {attachments.length === 0 ? (
            <p className="text-sm text-gray-400">
                No attachments yet.
            </p>
        ) : (
            attachments.map(
                (attachment: any) => (
                    <div
                        key={attachment._id}
                        className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-800 p-3"
                    >
                        <div>
                            <p className="font-medium">
                                {attachment.fileName}
                            </p>

                            <p className="text-sm text-gray-400">
                                {attachment.fileType}
                            </p>

                            <p className="text-xs text-gray-500">
                                Uploaded by{" "}
                                {attachment.uploadedBy?.name ||
                                    "Unknown"}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <a
                                href={
                                    attachment.fileUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600"
                            >
                                Open
                            </a>

                            <button
                                onClick={() =>
                                    handleDeleteAttachment(
                                        attachment._id
                                    )
                                }
                                disabled={
                                    deletingAttachment ===
                                    attachment._id
                                }
                                className="rounded-md bg-red-500 px-3 py-2 text-sm text-white disabled:opacity-50"
                            >
                                {deletingAttachment ===
                                attachment._id
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                )
            )
        )}
    </div>
</div>


            {/* Comments */}

            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 className="text-xl font-semibold">
        Comments
    </h2>

    {/* Add Comment */}
    <div className="mt-4">
        <textarea
            value={commentContent}
            onChange={(e) =>
                setCommentContent(e.target.value)
            }
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-sm outline-none"
        />

        <button
            onClick={handleCreateComment}
            disabled={
                creatingComment ||
                !commentContent.trim()
            }
            className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
            {creatingComment
                ? "Adding..."
                : "Add Comment"}
        </button>
    </div>

    {/* Comments List */}
    <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
            <p className="text-sm text-gray-400">
                No comments yet.
            </p>
        ) : (
            comments.map((comment: any) => (
                <div
                    key={comment._id}
                    className="rounded-md border border-gray-800 bg-gray-800 p-4"
                >
                    {editingCommentId === comment._id ? (
                        <>
                            <textarea
                                value={editingCommentContent}
                                onChange={(e) =>
                                    setEditingCommentContent(
                                        e.target.value
                                    )
                                }
                                rows={3}
                                className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-sm outline-none"
                            />

                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() =>
                                        handleUpdateComment(
                                            comment._id
                                        )
                                    }
                                    disabled={updatingComment}
                                    className="rounded-md bg-white px-3 py-2 text-sm text-black disabled:opacity-50"
                                >
                                    {updatingComment
                                        ? "Saving..."
                                        : "Save"}
                                </button>

                                <button
                                    onClick={() => {
                                        setEditingCommentId(null);
                                        setEditingCommentContent("");
                                    }}
                                    className="rounded-md border border-gray-700 px-3 py-2 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {comment.user?.name ||
                                            "Unknown User"}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {comment.user?.email}
                                    </p>
                                </div>

                                <p className="text-xs text-gray-500">
                                    {new Date(
                                        comment.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <p className="mt-3 text-sm text-gray-300">
                                {comment.content}
                            </p>

                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditingCommentId(
                                            comment._id
                                        );

                                        setEditingCommentContent(
                                            comment.content
                                        );
                                    }}
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDeleteComment(
                                            comment._id
                                        )
                                    }
                                    disabled={
                                        deletingCommentId ===
                                        comment._id
                                    }
                                    className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                                >
                                    {deletingCommentId ===
                                    comment._id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))
        )}
    </div>
</div>


            {/* Activity */}

            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 className="text-xl font-semibold">
        Activity
    </h2>

    <div className="mt-6 space-y-4">
        {activities.length === 0 ? (
            <p className="text-sm text-gray-400">
                No activity yet.
            </p>
        ) : (
            activities.map((activity: any) => (
                <div
                    key={activity._id}
                    className="flex gap-3 border-b border-gray-800 pb-4 last:border-0"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs">
                        {activity.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <p className="text-sm">
                            <span className="font-medium">
                                {activity.user?.name ||
                                    "Unknown User"}
                            </span>{" "}
                            <span className="text-gray-400">
                                {activity.action
                                    ?.toLowerCase()
                                    ?.replaceAll("_", " ")}
                            </span>
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {new Date(
                                activity.createdAt
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))
        )}
    </div>
</div>

        </div>
    );
}