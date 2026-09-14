import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ApplicationTrend from "../components/ApplicationTrend";
import Charts from "../components/Charts";
import DashboardInsights from "../components/DashboardInsights";

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
        applicationTrend: [],
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

    // -----------------------------------------
    // STATUS ANALYTICS DATA
    // -----------------------------------------

    const statusChartData = [
        {
            name: "Applied",
            value: stats.applied,
            color: "#3B82F6",
            gradient: "url(#appliedGradient)",
        },
        {
            name: "Interviews",
            value: stats.interviews,
            color: "#8B5CF6",
            gradient: "url(#interviewsGradient)",
        },
        {
            name: "Assessments",
            value: stats.assessments,
            color: "#F59E0B",
            gradient: "url(#assessmentsGradient)",
        },
        {
            name: "Offers",
            value: stats.offers,
            color: "#10B981",
            gradient: "url(#offersGradient)",
        },
        {
            name: "Rejected",
            value: stats.rejected,
            color: "#F43F5E",
            gradient: "url(#rejectedGradient)",
        },
        {
            name: "Withdrawn",
            value: stats.withdrawn,
            color: "#64748B",
            gradient: "url(#withdrawnGradient)",
        },
    ];

    const applicationTrendData = stats.applicationTrend.map((item) => ({
        date: item.date,
        applications: item.applications,
    }));

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
            icon: "●",
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
            icon: "★",
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

    // -----------------------------------------
    // LOADING STATE
    // -----------------------------------------

    if (loading) {
        return (
            <section>
                <div className="mb-8 animate-pulse">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="mt-3 h-10 w-52 rounded bg-slate-200" />
                    <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-100" />
                </div>

                <div className="mb-5 h-40 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm" />

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-[205px] animate-pulse rounded-2xl border border-slate-200 bg-white"
                        />
                    ))}
                </div>

                <div className="mt-6 h-[500px] animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm" />
            </section>
        );
    }

    // -----------------------------------------
    // ERROR STATE
    // -----------------------------------------

    if (error) {
        return (
            <section className="h-full p-4 sm:p-6 lg:p-8">
                <div className="flex h-full w-full items-center justify-center rounded-3xl border border-rose-200 bg-white p-10 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.5m0 4h.01M10.3 3.8l-7.1 12.3A2 2 0 005 19h14a2 2 0 001.8-2.9L13.7 3.8a2 2 0 00-3.4 0z" />
                            </svg>
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-slate-900">
                            Unable to load dashboard statistics
                        </h3>

                        <p className="mt-2 max-w-md text-sm text-slate-500">
                            We couldn't retrieve your application statistics.
                            Please try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section >
        );
    }

    // -----------------------------------------
    // MAIN DASHBOARD
    // -----------------------------------------

    return (
        <section className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                        Overview
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Dashboard
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Keep track of your job search and monitor your
                        application progress.
                    </p>
                </div>

                {/* Date / motivation card */}
                <div className="xl:flex items-center hidden  gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 px-4 py-3 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="17"
                                rx="2"
                            />
                            <path
                                strokeLinecap="round"
                                d="M16 2v4M8 2v4M3 10h18"
                            />
                        </svg>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            Your job search
                        </p>

                        <p className="text-xs text-slate-500">
                            Keep going! You're making progress.
                        </p>
                    </div>
                </div>
            </div>

            {/* Total Applications */}
            <div className="relative mb-5 overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-2xl">
                                📄
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Total Applications
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Your current job search
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                                {stats.totalApplications}
                            </span>

                            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                ↗ Active tracking
                            </span>
                        </div>
                    </div>

                    {/* Pipeline */}
                    <div className="w-full lg:max-w-xl">
                        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-bold text-blue-600">
                                    Application pipeline
                                </span>

                                <span className="text-sm font-medium text-slate-400">
                                    {stats.totalApplications} total
                                </span>
                            </div>

                            <div className="mt-4 h-3 overflow-hidden rounded-full bg-blue-100">
                                <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                            </div>

                            <p className="mt-3 text-xs italic text-slate-500">
                                Consistency today, opportunity tomorrow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Zero Applications */}
            {stats.totalApplications === 0 && (
                <div className="mb-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                    <Link
                        to="/applications/add"
                        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100"
                        aria-label="Add application"
                    >
                        <svg
                            className="h-7 w-7"
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
                    </Link>

                    <h3 className="mt-5 text-xl font-bold text-slate-900">
                        No applications yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                        Start tracking your job search by adding your first
                        application.
                    </p>
                </div>
            )}

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {statusStats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group relative flex min-h-[205px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${stat.iconClass}`}
                            >
                                {stat.icon}
                            </div>

                            <span
                                className={`h-2.5 w-2.5 rounded-full ${stat.dotClass}`}
                            />
                        </div>

                        <div className="mt-5 flex flex-1 flex-col">
                            <p className="text-sm font-bold text-slate-700">
                                {stat.label}
                            </p>

                            <p
                                className={`mt-1 text-4xl font-extrabold tracking-tight ${stat.valueClass}`}
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

            {/* Analytics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {/* Analytics Header */}
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600">
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
                                        d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-7"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Applications by Status
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Distribution of your current job applications.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 lg:self-auto">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                            <span className="text-sm font-semibold text-blue-700">
                                {stats.totalApplications} Applications
                            </span>
                        </div>
                    </div>

                    <Charts
                        statusChartData={statusChartData}
                    />
                </div>
                <ApplicationTrend
                    applicationTrendData={applicationTrendData}
                />
            </div>
            <DashboardInsights stats={stats} applicationTrendData={applicationTrendData} />
        </section>
    );
}

export default Dashboard;