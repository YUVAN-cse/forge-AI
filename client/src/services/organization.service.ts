import api from "@/lib/axios";

export const getOrganizations = async () => {
    const response = await api.get("/organizations");

    return response.data;
};

export const getOrganizationById = async (
    organizationId: string
) => {
    const response = await api.get(
        `/organizations/${organizationId}`
    );

    return response.data;
};

export const createOrganization = async (
    name: string,
    description: string
) => {
    const response = await api.post(
        "/organizations",
        {
            name,
            description,
        }
    );

    return response.data;
};

export const addMemberToOrganization = async (
    organizationId: string,
    email: string
) => {
    const response = await api.post(
        `/organizations/${organizationId}/members`,
        {
            email,
        }
    );

    return response.data;
};

export const removeMemberFromOrganization = async (
    organizationId: string,
    userId: string | null
) => {
    const response = await api.delete(
        `/organizations/${organizationId}/members/${userId}`
    );

    return response.data;
};

export const getMembersOfOrganization = async (
    organizationId: string
) => {
    const response = await api.get(
        `/organizations/${organizationId}/members`
    );

    return response.data;
};