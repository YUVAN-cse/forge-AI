"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    getOrganizations,
} from "@/services/organization.service";

import {
    getProjectsByOrganizationId,
    createProject,
} from "@/services/project.service";

export default function ProjectsPage() {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    const [search, setSearch] = useState("");
    const [selectedOrganization, setSelectedOrganization] =
        useState("all");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] =
        useState("");
    const [projectOrganization, setProjectOrganization] =
        useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const organizationResponse =
                await getOrganizations();

            const organizationsData =
                organizationResponse.organizations || [];

            setOrganizations(organizationsData);

            const projectResults =
                await Promise.all(
                    organizationsData.map(
                        async (organization: any) => {
                            try {
                                const response =
                                    await getProjectsByOrganizationId(
                                        organization._id
                                    );

                                return (
                                    response.projects || []
                                ).map(
                                    (project: any) => ({
                                        ...project,
                                        organizationData:
                                            organization,
                                    })
                                );
                            } catch {
                                return [];
                            }
                        }
                    )
                );

            const allProjects =
                projectResults.flat();

            setProjects(allProjects);

        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to load projects"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (
            !projectName.trim() ||
            !projectDescription.trim() ||
            !projectOrganization
        ) {
            setError(
                "Please fill all project fields"
            );
            return;
        }

        try {
            setCreating(true);
            setError("");

            await createProject(
                projectName,
                projectDescription,
                projectOrganization
            );

            setProjectName("");
            setProjectDescription("");
            setProjectOrganization("");

            setShowCreateForm(false);

            await fetchProjects();

        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to create project"
            );
        } finally {
            setCreating(false);
        }
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(
            (project: any) => {
                const matchesSearch =
                    project.name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchesOrganization =
                    selectedOrganization ===
                        "all" ||
                    project.organizationData?._id ===
                        selectedOrganization;

                return (
                    matchesSearch &&
                    matchesOrganization
                );
            }
        );
    }, [
        projects,
        search,
        selectedOrganization,
    ]);

    if (loading) {
        return (
            <div className="p-8">
                Loading projects...
            </div>
        );
    }

    return (
        <div className="p-8">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Projects
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage all your projects
                        across organizations.
                    </p>
                </div>

                <button
                    onClick={() =>
                        setShowCreateForm(
                            !showCreateForm
                        )
                    }
                    className="rounded-md bg-white px-4 py-2 text-black"
                >
                    {showCreateForm
                        ? "Cancel"
                        : "+ Create Project"}
                </button>

            </div>


            {/* Error */}
            {error && (
                <div className="mt-6 rounded-md border border-red-800 bg-red-950 p-4 text-red-400">
                    {error}
                </div>
            )}


            {/* Create Project */}
            {showCreateForm && (
                <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900 p-6">

                    <h2 className="text-xl font-semibold">
                        Create Project
                    </h2>

                    <div className="mt-4 space-y-4">

                        <input
                            type="text"
                            placeholder="Project name"
                            value={projectName}
                            onChange={(e) =>
                                setProjectName(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 outline-none"
                        />

                        <textarea
                            placeholder="Project description"
                            value={
                                projectDescription
                            }
                            onChange={(e) =>
                                setProjectDescription(
                                    e.target.value
                                )
                            }
                            rows={4}
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 outline-none"
                        />

                        <select
                            value={
                                projectOrganization
                            }
                            onChange={(e) =>
                                setProjectOrganization(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 outline-none"
                        >
                            <option value="">
                                Select organization
                            </option>

                            {organizations.map(
                                (
                                    organization: any
                                ) => (
                                    <option
                                        key={
                                            organization._id
                                        }
                                        value={
                                            organization._id
                                        }
                                    >
                                        {
                                            organization.name
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        <button
                            onClick={
                                handleCreateProject
                            }
                            disabled={creating}
                            className="rounded-md bg-white px-5 py-2 text-black disabled:opacity-50"
                        >
                            {creating
                                ? "Creating..."
                                : "Create Project"}
                        </button>

                    </div>
                </div>
            )}


            {/* Search + Filter */}
            <div className="mt-8 flex gap-4">

                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 outline-none"
                />

                <select
                    value={
                        selectedOrganization
                    }
                    onChange={(e) =>
                        setSelectedOrganization(
                            e.target.value
                        )
                    }
                    className="rounded-md border border-gray-700 bg-gray-900 px-4 py-3 outline-none"
                >
                    <option value="all">
                        All Organizations
                    </option>

                    {organizations.map(
                        (
                            organization: any
                        ) => (
                            <option
                                key={
                                    organization._id
                                }
                                value={
                                    organization._id
                                }
                            >
                                {
                                    organization.name
                                }
                            </option>
                        )
                    )}
                </select>

            </div>


            {/* Projects */}
            <div className="mt-8">

                <h2 className="text-xl font-semibold">
                    All Projects
                </h2>

                {filteredProjects.length === 0 ? (
                    <div className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">

                        <p className="text-gray-400">
                            No projects found.
                        </p>

                        <button
                            onClick={() =>
                                setShowCreateForm(
                                    true
                                )
                            }
                            className="mt-4 rounded-md bg-white px-4 py-2 text-black"
                        >
                            Create your first project
                        </button>

                    </div>
                ) : (

                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {filteredProjects.map(
                            (project: any) => (
                                <Link
                                    key={
                                        project._id
                                    }
                                    href={`/organizations/${project.organizationData?._id}/projects/${project._id}`}
                                    className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-600 hover:bg-gray-800"
                                >

                                    <h3 className="text-xl font-semibold">
                                        {
                                            project.name
                                        }
                                    </h3>

                                    <p className="mt-3 line-clamp-3 text-sm text-gray-400">
                                        {
                                            project.description
                                        }
                                    </p>

                                    <div className="mt-5 border-t border-gray-800 pt-4">

                                        <p className="text-sm text-gray-500">
                                            Organization
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {
                                                project
                                                    .organizationData
                                                    ?.name
                                            }
                                        </p>

                                    </div>

                                    <div className="mt-4 text-sm text-gray-500">
                                        Open project →
                                    </div>

                                </Link>
                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}