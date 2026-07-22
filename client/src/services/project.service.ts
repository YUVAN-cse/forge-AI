import api from "@/lib/axios";

export const getProjectsByOrganizationId = async (
    organizationId: string
) => {
    const response = await api.get(
        `/projects/organization/${organizationId}`
    );

    return response.data;
};

export const getProjectById = async (
    projectId: string
) => {
    const response = await api.get(
        `/projects/${projectId}`
    );

    return response.data;
};

export const createProject = async (
    name: string,
    description: string,
    organization: string
) => {
    const response = await api.post(
        "/projects",
        {
            name,
            description,
            organization,
        }
    );

    return response.data;
};