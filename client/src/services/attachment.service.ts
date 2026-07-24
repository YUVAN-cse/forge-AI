import api from "@/lib/axios";

export const createAttachment = async (
    taskId: string,
    file: File
) => {
    const formData = new FormData();

    formData.append("taskId", taskId);
    formData.append("file", file);

    const response = await api.post(
        "/attachments",
        formData
    );

    return response.data;
};

export const getAttachmentsByTaskId = async (
    taskId: string
) => {
    const response = await api.get(
        `/attachments/task/${taskId}`
    );

    return response.data;
};

export const deleteAttachment = async (
    attachmentId: string
) => {
    const response = await api.delete(
        `/attachments/${attachmentId}`
    );

    return response.data;
};