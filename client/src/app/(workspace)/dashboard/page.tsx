"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getOrganizations } from "@/services/organization.service";
import { getProjectsByOrganizationId } from "@/services/project.service";
import { getTasksByProjectId } from "@/services/task.service";

export default function DashboardPage() {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                // Get organizations
                const organizationResponse =
                    await getOrganizations();

                const organizationList =
                    organizationResponse.organizations || [];

                setOrganizations(organizationList);

                // Get projects for all organizations
                const projectResponses =
                    await Promise.all(
                        organizationList.map(
                            (organization: any) =>
                                getProjectsByOrganizationId(
                                    organization._id
                                )
                        )
                    );

                const projectList =
                    projectResponses.flatMap(
                        (response: any) =>
                            response.projects || []
                    );

                setProjects(projectList);

                // Get tasks for all projects
                const taskResponses =
                    await Promise.all(
                        projectList.map(
                            (project: any) =>
                                getTasksByProjectId(
                                    project._id
                                )
                        )
                    );

                const taskList =
                    taskResponses.flatMap(
                        (response: any) =>
                            response.tasks || []
                    );

                setTasks(taskList);

            } catch (error: any) {
                console.error(
                    "Dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const completedTasks =
        tasks.filter(
            (task) =>
                task.status === "COMPLETED" ||
                task.status === "completed"
        ).length;

    const pendingTasks =
        tasks.length - completedTasks;

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-400">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-400">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                    Welcome to your ForgeAI workspace.
                </p>
            </div>


            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">

                {/* Organizations */}
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-500">
                        Organizations
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {organizations.length}
                    </h2>
                </div>


                {/* Projects */}
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-500">
                        Projects
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {projects.length}
                    </h2>
                </div>


                {/* Total Tasks */}
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-500">
                        Total Tasks
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {tasks.length}
                    </h2>
                </div>


                {/* Completed Tasks */}
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-500">
                        Completed Tasks
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {completedTasks}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {pendingTasks} pending
                    </p>
                </div>

            </div>


            {/* Organizations */}
            <div className="mt-8">

                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Your Organizations
                    </h2>
                </div>


                {organizations.length === 0 ? (
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                        <p className="text-gray-400">
                            You don't have any organizations yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {organizations.map(
                            (organization: any) => (
                                <Link
                                    key={organization._id}
                                    href={`/organizations/${organization._id}`}
                                    className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-600"
                                >

                                    <h3 className="text-lg font-semibold">
                                        {organization.name}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-400">
                                        {organization.description ||
                                            "No description"}
                                    </p>

                                </Link>
                            )
                        )}

                    </div>
                )}

            </div>


            {/* Projects */}
            <div className="mt-8">

                <div className="mb-4">
                    <h2 className="text-xl font-semibold">
                        Recent Projects
                    </h2>
                </div>


                {projects.length === 0 ? (
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                        <p className="text-gray-400">
                            No projects available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {projects
                            .slice(0, 6)
                            .map(
                                (project: any) => (
                                    <Link
                                        key={project._id}
                                        href={`/organizations/${project.organization?._id || project.organization}/projects/${project._id}`}
                                        className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-600"
                                    >

                                        <h3 className="text-lg font-semibold">
                                            {project.name}
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-400">
                                            {project.description ||
                                                "No description"}
                                        </p>

                                    </Link>
                                )
                            )}

                    </div>
                )}

            </div>


            {/* Task Overview */}
            <div className="mt-8">

                <h2 className="mb-4 text-xl font-semibold">
                    Task Overview
                </h2>

                <div className="grid gap-6 md:grid-cols-2">

                    {/* Completed */}
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">

                        <p className="text-sm text-gray-500">
                            Completed Tasks
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {completedTasks}
                        </h3>

                    </div>


                    {/* Pending */}
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">

                        <p className="text-sm text-gray-500">
                            Pending Tasks
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {pendingTasks}
                        </h3>

                    </div>

                </div>

            </div>

        </div>
    );
}