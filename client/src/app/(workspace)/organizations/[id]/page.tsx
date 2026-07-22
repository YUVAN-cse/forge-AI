"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    getOrganizationById,
    getMembersOfOrganization,
    addMemberToOrganization,
    removeMemberFromOrganization
} from "@/services/organization.service";

import {
    getProjectsByOrganizationId,
    createProject,
} from "@/services/project.service";

import Link from "next/link";

export default function OrganizationDetailsPage() {
    const params = useParams();

    const organizationId = params.id as string;

    const [organization, setOrganization] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [email, setEmail] = useState("");
    const [addingMember, setAddingMember] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [creatingProject, setCreatingProject] = useState(false);
    const [removingMember, setRemovingMember] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const response =
                    await getOrganizationById(organizationId);

                setOrganization(response.organization);
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch organization"
                );
            }
        };

        const fetchMembers = async () => {
            try {
                const response =
                    await getMembersOfOrganization(organizationId);

                setMembers(response.members || []);
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch members"
                );
            }
        };

        const fetchData = async () => {
            setLoading(true);

            await Promise.all([
                fetchOrganization(),
                fetchMembers(),
                fetchProjects()
            ]);

            setLoading(false);
        };

        fetchData();
    }, [organizationId]);

    const handleAddMember = async () => {
        if (!email.trim()) {
            return;
        }

        try {
            setAddingMember(true);
            setError("");

            await addMemberToOrganization(
                organizationId,
                email
            );

            setEmail("");

            const response =
                await getMembersOfOrganization(organizationId);

            setMembers(response.members || []);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to add member"
            );
        } finally {
            setAddingMember(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
    try {
        setRemovingMember(userId);
        setError("");

        await removeMemberFromOrganization(
            organizationId,
            userId
        );

        const response =
            await getMembersOfOrganization(organizationId);

        setMembers(response.members || []);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to remove member"
            );
        } finally {
            setRemovingMember(null);
        }
        };

        const fetchProjects = async () => {
            try {
                const response =
                    await getProjectsByOrganizationId(organizationId);

                setProjects(response.projects || []);
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch projects"
                );
            }
        };

        const handleCreateProject = async () => {
    if (!projectName.trim() || !projectDescription.trim()) {
        return;
    }

    try {
        setCreatingProject(true);
        setError("");

        await createProject(
            projectName,
            projectDescription,
            organizationId
        );

        setProjectName("");
        setProjectDescription("");

        const response =
            await getProjectsByOrganizationId(organizationId);

        setProjects(response.projects || []);
    } catch (error: any) {
        setError(
            error.response?.data?.message ||
            "Failed to create project"
        );
    } finally {
        setCreatingProject(false);
    }
};

    if (loading) {
        return <div>Loading organization...</div>;
    }

    if (error) {
        return (
            <div className="text-red-400">
                {error}
            </div>
        );
    }

    if (!organization) {
        return (
            <div>
                Organization not found
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">
                {organization.name}
            </h1>

            <p className="mt-2 text-gray-400">
                {organization.description}
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold">
                        Members
                    </h2>

                    <div className="mt-4 flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter member email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                        />

                        <button
                            onClick={handleAddMember}
                            disabled={addingMember}
                            className="rounded-md bg-white px-4 py-2 text-black disabled:opacity-50"
                        >
                            {addingMember
                                ? "Adding..."
                                : "Add Member"}
                        </button>
                    </div>

                    <div className="mt-6 space-y-3">
                        {members.map((member: any) => (
                            <div
                                key={member._id}
                                className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-800 p-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {member.name}
                                    </p>

                                    <p className="text-sm text-gray-400">
                                        {member.email}
                                    </p>
                                </div>
                            {
                                organization.owner != member._id &&(
                                <button
                                    onClick={() => handleRemoveMember(member._id)}
                                    disabled={removingMember === member._id}
                                    className="rounded-md bg-red-500 px-3 py-2 text-sm text-white disabled:opacity-50"
                                >
                                    {removingMember === member._id
                                        ? "Removing..."
                                        : "Remove"}
                                </button>
                                )
                            }
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 className="text-xl font-semibold">
        Projects
    </h2>

    <div className="mt-4 space-y-3">
        <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) =>
                setProjectName(e.target.value)
            }
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
        />

        <textarea
            placeholder="Project description"
            value={projectDescription}
            onChange={(e) =>
                setProjectDescription(e.target.value)
            }
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
            rows={3}
        />

        <button
            onClick={handleCreateProject}
            disabled={creatingProject}
            className="rounded-md bg-white px-4 py-2 text-black disabled:opacity-50"
        >
            {creatingProject
                ? "Creating..."
                : "Create Project"}
        </button>
    </div>

    <div className="mt-6 space-y-3">
        {projects.length === 0 ? (
            <p className="text-gray-400">
                No projects yet.
            </p>
        ) : (
            projects.map((project: any) => (
    <Link
        key={project._id}
        href={`/organizations/${organizationId}/projects/${project._id}`}
        className="block rounded-md border border-gray-800 bg-gray-800 p-4 transition hover:border-gray-600"
    >
        <h3 className="font-semibold">
            {project.name}
        </h3>

        <p className="mt-1 text-sm text-gray-400">
            {project.description}
        </p>
    </Link>
))
        )}
    </div>
</div>
            </div>
        </div>
    );
}