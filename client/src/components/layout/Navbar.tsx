"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
    const router = useRouter();

    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <header className="fixed left-64 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950 px-6 text-white">
            <div>
                <h2 className="font-semibold">
                    Workspace
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm">
                    {user?.name}
                </span>

                <button
                    onClick={handleLogout}
                    className="rounded-md border border-gray-700 px-3 py-2 text-sm hover:bg-gray-900"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}