"use client";

import { useEffect, useState } from "react";
import { getOrganizations } from "@/services/organization.service";
import { Organization } from "@/types/organization";
import Link from "next/link";

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                setLoading(true);

                const response = await getOrganizations();

                setOrganizations(response.organizations || []);
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch organizations"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold">
                    Organizations
                </h1>

                <p className="mt-4 text-gray-400">
                    Loading organizations...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold">
                    Organizations
                </h1>

                <p className="mt-4 text-red-400">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Organizations
                </h1>

                <p className="mt-2 text-gray-400">
                    Manage your organizations and teams.
                </p>
            </div>

            {organizations.length === 0 ? (
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
                    <h2 className="text-xl font-semibold">
                        No organizations yet
                    </h2>

                    <p className="mt-2 text-gray-400">
                        Create your first organization to get started.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {organizations.map((organization) => (
                        <Link
                        key={organization._id}
                        href={`/organizations/${organization._id}`}
                        className="block rounded-lg border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-600"
                    >
                        <h2 className="text-xl font-semibold">
                            {organization.name}
                        </h2>

                        {organization.description && (
                            <p className="mt-2 text-gray-400">
                                {organization.description}
                            </p>
                        )}

                        <p className="mt-4 text-sm text-gray-500">
                            {organization.members?.length || 0} members
                        </p>
                    </Link>
                    ))}
                </div>
            )}
        </div>
    );
}