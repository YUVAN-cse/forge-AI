"use client";

interface CodeViewerProps {
    fileName: string;
    filePath: string;
    content: string;
}

export default function CodeViewer({
    fileName,
    filePath,
    content,
}: CodeViewerProps) {

    return (
        <div className="flex h-full flex-col rounded-lg border border-gray-800 bg-gray-900">

            {/* Header */}
            <div className="border-b border-gray-800 px-4 py-3">

                <h2 className="text-lg font-semibold">
                    {fileName}
                </h2>

                <p className="text-sm text-gray-500">
                    {filePath}
                </p>

            </div>

            {/* Code */}
            <div className="flex-1 overflow-auto">

                <pre className="min-h-full p-4 text-sm">
                    <code>
                        {content}
                    </code>
                </pre>

            </div>

        </div>
    );
}