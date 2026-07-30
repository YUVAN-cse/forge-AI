import api from "@/lib/axios";

export const getRepositoryFile = async (
    repositoryId: string,
    path: string
) => {

    const response = await api.get(
        `/repositories/${repositoryId}/file`,
        {
            params: {
                path,
            },
        }
    );

    return response.data.file;
};