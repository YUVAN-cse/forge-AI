import api from "@/lib/axios";

export const getTasksByProjectId = async (
    projectId: string
) => {
    const response = await api.get(
        `/tasks/project/${projectId}`
    );

    return response.data;
};

export const createTask = async (
    projectId: string,
    title: string,
    description: string,
    assignedTo?: string
) => {
    const response = await api.post(
        "/tasks",
        {
            project: projectId,
            title,
            description,
            assignedTo: assignedTo || undefined,
        }
    );

    return response.data;
};

export const updateTaskStatus = async (
    taskId: string,
    status: string
) => {
    const response = await api.patch(
        `/tasks/${taskId}`,
        {
            status,
        }
    );

    return response.data;
};

export const deleteTask = async (
    taskId: string
) => {
    const response = await api.delete(
        `/tasks/${taskId}`
    );

    return response.data;
};