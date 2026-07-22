export interface OrganizationMember {
    _id: string;
    name: string;
    email: string;
}

export interface Organization {
    _id: string;
    name: string;
    description: string;
    owner: string;
    members: OrganizationMember[];
    createdAt: string;
    updatedAt: string;
}