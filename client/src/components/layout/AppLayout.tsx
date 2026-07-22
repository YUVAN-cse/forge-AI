"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-950 text-white">
                <Sidebar />

                <Navbar />

                <main className="ml-64 pt-16">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}