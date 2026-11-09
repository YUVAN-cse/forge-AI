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


export const generateRepositoryUML = async (
    repositoryId: string,
    diagramType: "class" | "sequence" | "component"
) => {
    const response = await api.post(
        `/repositories/${repositoryId}/uml`,
        {
            diagramType,
        }
    );

    return response.data.uml;
};
