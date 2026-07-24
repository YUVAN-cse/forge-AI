import api from "@/lib/axios";

export const getMessagesByProjectId = async (
    projectId: string
) => {
    const response = await api.get(
        `/messages/project/${projectId}`
    );

    return response.data;
};

export const createMessage = async (
    projectId: string,
    content: string
) => {
    const response = await api.post(
        "/messages",
        {
            project: projectId,
            content,
        }
    );

    return response.data;
};

export const deleteMessage = async (
    messageId: string
) => {
    const response = await api.delete(
        `/messages/${messageId}`
    );

    return response.data;
};