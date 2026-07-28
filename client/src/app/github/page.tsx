"use client";

import { useEffect, useState } from "react";

import ConnectGithubButton from "@/components/github/ConnectGithubButton";

import { getGithubAccount } from "@/services/github.service";

export default function GithubPage() {

    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkGithubConnection();
    }, []);

    const checkGithubConnection = async () => {
        try {

            const response = await getGithubAccount();

            setConnected(response.connected);

        } catch (error) {

            console.error(
                "Failed to check GitHub connection:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="p-8">
                Checking GitHub connection...
            </div>
        );
    }

    return (
        <div className="p-8">

            <div>
                <h1 className="text-3xl font-bold">
                    GitHub
                </h1>

                <p className="mt-2 text-gray-500">
                    Connect your GitHub account and
                    import repositories into ForgeAI.
                </p>
            </div>

            <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900 p-6">

                {connected ? (

                    <div>

                        <h2 className="text-xl font-semibold">
                            GitHub Connected ✓
                        </h2>

                        <p className="mt-2 text-gray-400">
                            Your GitHub account is connected
                            to ForgeAI.
                        </p>

                    </div>

                ) : (

                    <div>

                        <h2 className="text-xl font-semibold">
                            Connect GitHub
                        </h2>

                        <p className="mt-2 text-gray-400">
                            Connect your GitHub account to
                            browse and import repositories.
                        </p>

                        <div className="mt-5">
                            <ConnectGithubButton />
                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}