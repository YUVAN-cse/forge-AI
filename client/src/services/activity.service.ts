import api from "@/lib/axios";

export const getActivityByTaskId = async (
    taskId: string
) => {
    const response = await api.get(
        `/tasks/${taskId}/activity`
    );

    return response.data;
};