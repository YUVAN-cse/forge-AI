export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                    Welcome to your ForgeAI workspace.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-500">
                        Organizations
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        0
                    </h2>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-500">
                        Projects
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        0
                    </h2>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-500">
                        Tasks
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        0
                    </h2>
                </div>
            </div>
        </div>
    );
}