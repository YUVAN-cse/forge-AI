"use client";

import { connectGithub } from "@/services/github.service";

export default function ConnectGithubButton() {
    const handleConnect = () => {
        connectGithub();
    };

    return (
        <button
            onClick={handleConnect}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
        >
            Connect GitHub
        </button>
    );
}