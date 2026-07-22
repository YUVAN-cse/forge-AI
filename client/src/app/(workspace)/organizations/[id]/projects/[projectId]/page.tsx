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

import { getMembersOfOrganization } from "@/services/organization.service";

export default function ProjectDetailsPage() {
    const params = useParams();

    const projectId = params.projectId as string;

    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [creatingTask, setCreatingTask] = useState(false);
    const [error, setError] = useState("");

    const [members, setMembers] = useState<any[]>([]);
    const [assignedTo, setAssignedTo] = useState("");   

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
                               <div
    key={task._id}
    className="rounded-md border border-gray-800 bg-gray-800 p-4"
>
    <div className="flex items-start justify-between">
        <div>
            <h3 className="font-semibold">
                {task.title}
            </h3>

            <p className="mt-1 text-sm text-gray-400">
                {task.description}
            </p>
            <p className="mt-1 text-sm text-gray-400">
                {task.assignedTo
                    ? `Assigned to: ${task.assignedTo.name} (${task.assignedTo.email})`
                    : "Not assigned"}
            </p>
        </div>

        <button
            onClick={() =>
                handleDeleteTask(task._id)
            }
            className="text-sm text-red-400 hover:text-red-300"
        >
            Delete
        </button>
    </div>

    <div className="mt-4 flex gap-2">
        <button
            onClick={() =>
                handleUpdateStatus(
                    task._id,
                    "TODO"
                )
            }
            className={`rounded-md px-3 py-1 text-xs ${
                task.status === "TODO"
                    ? "bg-white text-black"
                    : "bg-gray-700 text-gray-300"
            }`}
        >
            TODO
        </button>

        <button
            onClick={() =>
                handleUpdateStatus(
                    task._id,
                    "IN_PROGRESS"
                )
            }
            className={`rounded-md px-3 py-1 text-xs ${
                task.status === "IN_PROGRESS"
                    ? "bg-white text-black"
                    : "bg-gray-700 text-gray-300"
            }`}
        >
            IN PROGRESS
        </button>

        <button
            onClick={() =>
                handleUpdateStatus(
                    task._id,
                    "DONE"
                )
            }
            className={`rounded-md px-3 py-1 text-xs ${
                task.status === "DONE"
                    ? "bg-white text-black"
                    : "bg-gray-700 text-gray-300"
            }`}
        >
            DONE
        </button>
    </div>
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

                    <p className="mt-2 text-gray-400">
                        Activity will appear here.
                    </p>
                </div>

                {/* Comments */}
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold">
                        Comments
                    </h2>

                    <p className="mt-2 text-gray-400">
                        Comments will appear here.
                    </p>
                </div>

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