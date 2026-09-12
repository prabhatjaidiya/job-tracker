import { useEffect, useState } from "react";

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [stats, setStats] = useState({
        totalApplications: 0,
        applied: 0,
        interviews: 0,
        assessments: 0,
        offers: 0,
        rejected: 0,
        withdrawn: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/applications/stats",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch application stats");
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message || "Failed to fetch application stats"
                    );
                }

                setStats(result.data);
            } catch (error) {
                console.error(
                    "Failed to fetch application stats:",
                    error
                );

                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statusStats = [
        {
            label: "Applied",
            value: stats.applied,
            description: "Applications submitted",
            icon: "↑",
            iconClass: "bg-blue-100 text-blue-600",
            valueClass: "text-blue-600",
            dotClass: "bg-blue-500",
        },
        {
            label: "Interviews",
            value: stats.interviews,
            description: "Interviews scheduled",
            icon: "💬",
            iconClass: "bg-violet-100 text-violet-600",
            valueClass: "text-violet-600",
            dotClass: "bg-violet-500",
        },
        {
            label: "Assessments",
            value: stats.assessments,
            description: "Assessments pending",
            icon: "□",
            iconClass: "bg-amber-100 text-amber-600",
            valueClass: "text-amber-600",
            dotClass: "bg-amber-500",
        },
        {
            label: "Offers",
            value: stats.offers,
            description: "Offers received",
            icon: "$",
            iconClass: "bg-emerald-100 text-emerald-600",
            valueClass: "text-emerald-600",
            dotClass: "bg-emerald-500",
        },
        {
            label: "Rejected",
            value: stats.rejected,
            description: "Applications rejected",
            icon: "×",
            iconClass: "bg-rose-100 text-rose-600",
            valueClass: "text-rose-600",
            dotClass: "bg-rose-500",
        },
        {
            label: "Withdrawn",
            value: stats.withdrawn,
            description: "Applications withdrawn",
            icon: "↩",
            iconClass: "bg-slate-100 text-slate-600",
            valueClass: "text-slate-700",
            dotClass: "bg-slate-500",
        },
    ];

    return (
        <section>
            {/* Header */}
            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                    Overview
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Dashboard
                </h2>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    Keep track of your job search and monitor your application
                    progress.
                </p>
            </div>

            {loading ? (
                <>
                    {/* Total Applications Skeleton */}
                    <div className="mb-5 animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-xl bg-slate-200" />

                                    <div className="space-y-2">
                                        <div className="h-4 w-36 rounded bg-slate-200" />
                                        <div className="h-3 w-28 rounded bg-slate-100" />
                                    </div>
                                </div>

                                <div className="mt-4 h-12 w-20 rounded-lg bg-slate-200" />
                            </div>

                            <div className="w-full max-w-xs rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <div className="h-3 w-32 rounded bg-slate-200" />

                                <div className="mt-4 h-2 rounded-full bg-slate-200" />
                            </div>
                        </div>
                    </div>

                    {/* Six Status Card Skeletons */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex min-h-[205px] animate-pulse flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-slate-200" />

                                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                                </div>

                                <div className="mt-5">
                                    <div className="h-4 w-20 rounded bg-slate-200" />

                                    <div className="mt-2 h-10 w-12 rounded-lg bg-slate-200" />

                                    <div className="mt-6 h-3 w-32 rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.5m0 4h.01M10.3 3.8l-7.1 12.3A2 2 0 005 19h14a2 2 0 001.8-2.9L13.7 3.8a2 2 0 00-3.4 0z"
                                />
                            </svg>
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            Unable to load dashboard statistics
                        </h3>

                        <p className="mt-2 max-w-md text-sm text-slate-500">
                            We couldn't retrieve your application statistics. Please
                            try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Total Applications */}
                    <div className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            {/* Left */}
                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                                        📄
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-base font-semibold text-slate-800">
                                            Total Applications
                                        </h2>

                                        <p className="text-sm text-slate-400">
                                            Your current job search
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center gap-3">
                                    <span className="text-5xl font-bold text-slate-900">
                                        {stats.totalApplications}
                                    </span>

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                        Active tracking
                                    </span>
                                </div>
                            </div>

                            {/* Pipeline */}
                            <div className="w-full lg:max-w-sm">
                                <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-medium text-blue-600">
                                            Application pipeline
                                        </span>

                                        <span className="shrink-0 text-sm text-slate-400">
                                            {stats.totalApplications} total
                                        </span>
                                    </div>

                                    <div className="mt-4 h-2 rounded-full bg-blue-100">
                                        <div className="h-2 w-full rounded-full bg-blue-500" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {stats.totalApplications === 0 && (
                        <div className="mb-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v12m6-6H6"
                                    />
                                </svg>
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No applications yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Start tracking your job search by adding your first application.
                            </p>
                        </div>
                    )}
                    {/* Six Status Cards */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                        {statusStats.map((stat) => (
                            <div
                                key={stat.label}
                                className="group relative flex min-h-[205px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-medium ${stat.iconClass}`}
                                    >
                                        {stat.icon}
                                    </div>

                                    <span
                                        className={`h-2 w-2 rounded-full ${stat.dotClass}`}
                                    />
                                </div>

                                <div className="mt-5 flex flex-1 flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        {stat.label}
                                    </p>

                                    <p
                                        className={`mt-1 text-4xl font-bold tracking-tight ${stat.valueClass}`}
                                    >
                                        {stat.value}
                                    </p>

                                    <p className="mt-auto pt-3 text-xs leading-5 text-slate-400">
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default Dashboard;