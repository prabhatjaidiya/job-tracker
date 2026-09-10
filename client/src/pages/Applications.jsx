import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            setError("");

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/applications",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || "Failed to fetch applications."
                    );
                    return;
                }

                setApplications(data.data);
            } catch (error) {
                setError("Unable to connect to the server.");
                console.error(
                    "Failed to fetch applications:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case "Applied":
                return {
                    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
                    dot: "bg-blue-500",
                    accent: "from-blue-500 to-cyan-500",
                };

            case "Interview":
                return {
                    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
                    dot: "bg-amber-500",
                    accent: "from-amber-500 to-orange-500",
                };

            case "Assessment":
                return {
                    badge: "bg-violet-50 text-violet-700 ring-violet-600/20",
                    dot: "bg-violet-500",
                    accent: "from-violet-500 to-purple-500",
                };

            case "Offer":
                return {
                    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
                    dot: "bg-emerald-500",
                    accent: "from-emerald-500 to-teal-500",
                };

            case "Rejected":
                return {
                    badge: "bg-red-50 text-red-700 ring-red-600/20",
                    dot: "bg-red-500",
                    accent: "from-red-500 to-rose-500",
                };

            case "Withdrawn":
                return {
                    badge: "bg-slate-100 text-slate-600 ring-slate-500/20",
                    dot: "bg-slate-400",
                    accent: "from-slate-500 to-slate-600",
                };

            default:
                return {
                    badge: "bg-slate-100 text-slate-600 ring-slate-500/20",
                    dot: "bg-slate-400",
                    accent: "from-slate-500 to-slate-600",
                };
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getCompanyInitial = (company) => {
        if (!company) {
            return "?";
        }

        return company.charAt(0).toUpperCase();
    };

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            Job Tracker
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Applications
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Keep track of your job applications,
                            deadlines, and current progress.
                        </p>
                    </div>

                    <Link
                        to="/applications/add"
                        className="inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md"
                    >
                        <span className="text-lg leading-none">
                            +
                        </span>

                        Add Application
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                                !
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-red-700">
                                    Something went wrong
                                </p>

                                <p className="mt-1 text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">

                    {/* Card Header */}
                    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 px-6 py-5 sm:px-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Your Applications
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {applications.length}{" "}
                                    {applications.length === 1
                                        ? "application"
                                        : "applications"}{" "}
                                    tracked
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                💼
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="space-y-4 p-6 sm:p-8">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-2xl border border-slate-200 p-5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-200" />

                                        <div className="flex-1">
                                            <div className="h-4 w-1/3 rounded bg-slate-200" />
                                            <div className="mt-2 h-3 w-1/4 rounded bg-slate-100" />
                                        </div>

                                        <div className="h-8 w-20 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : applications.length === 0 ? (
                        /* Empty State */
                        <div className="p-8 sm:p-12">
                            <div className="mx-auto max-w-md text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                                    💼
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-900">
                                    No applications yet
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Start tracking your job search by
                                    adding your first application.
                                </p>

                                <Link
                                    to="/applications/add"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                                >
                                    <span>+</span>
                                    Add Your First Application
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Application List */
                        <div className="divide-y divide-slate-100">
                            {applications.map((application) => {
                                const statusStyles =
                                    getStatusStyles(
                                        application.status
                                    );

                                return (
                                    <div
                                        key={application._id}
                                        className="group relative p-5 transition duration-200 hover:bg-slate-50/70 sm:p-6"
                                    >
                                        {/* Status Accent */}
                                        <div
                                            className={`absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b ${statusStyles.accent} opacity-0 transition group-hover:opacity-100`}
                                        />

                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                            {/* Company + Position */}
                                            <div className="flex min-w-0 items-start gap-4">
                                                <div
                                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${statusStyles.accent} text-lg font-bold text-white shadow-sm`}
                                                >
                                                    {getCompanyInitial(
                                                        application.company
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                                        {
                                                            application.position
                                                        }
                                                    </h3>

                                                    <p className="mt-1 truncate text-sm font-medium text-slate-500">
                                                        {
                                                            application.company
                                                        }
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        {application.location && (
                                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                📍{" "}
                                                                {
                                                                    application.location
                                                                }
                                                            </span>
                                                        )}

                                                        {application.jobType && (
                                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                💼{" "}
                                                                {
                                                                    application.jobType
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="lg:w-32">
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Status
                                                </p>

                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles.badge}`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${statusStyles.dot}`}
                                                    />

                                                    {
                                                        application.status
                                                    }
                                                </span>
                                            </div>

                                            {/* Dates */}
                                            <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center sm:gap-8 lg:w-64">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Applied
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                                        {formatDate(
                                                            application.appliedDate
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Deadline
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                                        {formatDate(
                                                            application.deadline
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* View */}
                                            <Link
                                                to={`/applications/${application._id}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md lg:w-auto"
                                            >
                                                View Details
                                                <span className="transition-transform group-hover:translate-x-0.5">
                                                    →
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && applications.length > 0 && (
                    <div className="py-5 text-center">
                        <p className="text-xs text-slate-400">
                            Select an application to view its
                            complete details.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Applications;