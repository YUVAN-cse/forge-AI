"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
    },
    {
        name: "Organizations",
        href: "/organizations",
    },
    {
        name: "Projects",
        href: "/projects",
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-800 bg-gray-950 p-4 text-white">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    ForgeAI
                </h1>

                <p className="text-sm text-gray-500">
                    AI Engineering Workspace
                </p>
            </div>

            <nav className="space-y-2">
                {navigation.map((item) => {
                    const isActive =
                        pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block rounded-md px-3 py-2 ${
                                isActive
                                    ? "bg-white text-black"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}