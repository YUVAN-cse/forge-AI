
"use client";

import { useState } from "react";
import {
    Bot,
    Send,
    Loader2,
    FileCode2,
    UserRound,
} from "lucide-react";

import {
    askRepositoryAssistant,
} from "@/services/repositoryAssistant.service";

interface RepositoryAssistantProps {
    repositoryId: string;
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
}

const suggestions = [
    "Explain the architecture of this repository",
    "How does authentication work?",
    "Where are database operations handled?",
    "Explain the main application flow",
];

export default function RepositoryAssistant({
    repositoryId,
}: RepositoryAssistantProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sendQuestion = async (value?: string) => {
        const text = (value ?? question).trim();

        if (!text || loading || text.length > 2000) {
            return;
        }

        setError("");
        setQuestion("");
        setLoading(true);

        setMessages((previous) => [
            ...previous,
            {
                role: "user",
                content: text,
            },
        ]);

        try {
            const result = await askRepositoryAssistant(
                repositoryId,
                text
            );

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: result.answer,
                    sources: result.sources,
                },
            ]);
        } catch (err) {
            console.error("Repository Assistant Error:", err);

            setError(
                "Failed to get an AI response. Please try again."
            );

            setQuestion(text);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            <div className="flex items-center gap-3 border-b border-gray-800 p-5">
                <div className="rounded-lg bg-blue-500/10 p-2">
                    <Bot className="text-blue-400" size={22} />
                </div>

                <div>
                    <h2 className="font-semibold text-white">
                        AI Repository Assistant
                    </h2>
                    <p className="text-xs text-gray-400">
                        Ask questions about your repository codebase.
                    </p>
                </div>
            </div>

            <div className="max-h-[500px] min-h-[320px] space-y-4 overflow-y-auto p-5">
                {messages.length === 0 && (
                    <div className="space-y-5 py-8">
                        <div className="text-center">
                            <Bot
                                size={32}
                                className="mx-auto mb-3 text-gray-500"
                            />
                            <h3 className="font-medium text-white">
                                Explore your codebase with AI
                            </h3>
                            <p className="mt-2 text-sm text-gray-400">
                                Ask about architecture, functions,
                                dependencies, or implementation details.
                            </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() =>
                                        sendQuestion(suggestion)
                                    }
                                    disabled={loading}
                                    className="rounded-lg border border-gray-700 bg-gray-950 p-3 text-left text-sm text-gray-300 transition hover:border-gray-500 hover:text-white disabled:opacity-50"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 ${
                            message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        {message.role === "assistant" && (
                            <Bot
                                size={20}
                                className="mt-2 shrink-0 text-blue-400"
                            />
                        )}

                        <div
                            className={`max-w-[85%] rounded-xl p-4 ${
                                message.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-800 bg-gray-950 text-gray-200"
                            }`}
                        >
                            <p className="whitespace-pre-wrap break-words text-sm leading-7">
                                {message.content}
                            </p>

                            {message.sources &&
                                message.sources.length > 0 && (
                                    <div className="mt-4 border-t border-gray-800 pt-3">
                                        <p className="mb-2 text-xs font-medium text-gray-400">
                                            Retrieved Source Files
                                        </p>

                                        <div className="space-y-2">
                                            {message.sources.map((source) => (
                                                <div
                                                    key={source}
                                                    className="flex items-start gap-2 text-xs text-blue-300"
                                                >
                                                    <FileCode2
                                                        size={14}
                                                        className="mt-0.5 shrink-0"
                                                    />
                                                    <span className="break-all">
                                                        {source}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>

                        {message.role === "user" && (
                            <UserRound
                                size={20}
                                className="mt-2 shrink-0 text-gray-400"
                            />
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Loader2
                            size={18}
                            className="animate-spin text-blue-400"
                        />
                        Analyzing repository context...
                    </div>
                )}
            </div>

            {error && (
                <p className="px-5 pb-3 text-sm text-red-400">
                    {error}
                </p>
            )}

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    sendQuestion();
                }}
                className="flex gap-3 border-t border-gray-800 p-4"
            >
                <input
                    value={question}
                    onChange={(event) =>
                        setQuestion(event.target.value)
                    }
                    placeholder="Ask something about this repository..."
                    maxLength={2000}
                    disabled={loading}
                    className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
                />

                <button
                    type="submit"
                    disabled={!question.trim() || loading}
                    className="flex items-center justify-center rounded-lg bg-blue-600 px-4 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <Send size={18} />
                    )}
                </button>
            </form>
        </div>
    );
}
