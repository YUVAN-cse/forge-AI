"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";


export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await login(email, password);

            router.push("/dashboard");
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md rounded-lg border p-8 shadow-sm">
                <h1 className="mb-2 text-3xl font-bold">
                    Welcome to ForgeAI
                </h1>

                <p className="mb-6 text-gray-500">
                    Sign in to your workspace
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-md border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="••••••••"
                            required
                            className="w-full rounded-md border p-2"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-black p-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-zinc-950"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    );
}