import api from "@/lib/axios";

export const askProjectAI = async (
    projectId: string,
    question: string
) => {
    const response = await api.post(
        `/ai/projects/${projectId}/ask`,
        {
            question,
        }
    );

    return response.data;
};


export const getProjectSummary = async (
    projectId: string
) => {
    const response = await api.get(
        `/ai/projects/${projectId}/summary`
    );

    return response.data;
};


export const askTaskAI = async (
    taskId: string,
    question: string
) => {
    const response = await api.post(
        `/ai/tasks/${taskId}/ask`,
        {
            question,
        }
    );

    return response.data;
};

export const generateProjectTasks = async (
    projectId: string,
    requirement: string
) => {
    const response = await api.post(
        `/ai/projects/${projectId}/generate-tasks`,
        {
            requirement,
        }
    );

    return response.data;
};