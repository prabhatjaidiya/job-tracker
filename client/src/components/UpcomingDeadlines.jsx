import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const difference =
        deadlineDate.getTime() - today.getTime();

    return Math.round(
        difference / (1000 * 60 * 60 * 24)
    );
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getDeadlineStatus = (daysRemaining) => {
    if (daysRemaining === 0) {
        return {
            label: "Due today",
            className:
                "border-red-200 bg-red-50 text-red-700",
        };
    }

    if (daysRemaining <= 2) {
        return {
            label: `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"
                } left`,
            className:
                "border-orange-200 bg-orange-50 text-orange-700",
        };
    }

    return {
        label: `${daysRemaining} days left`,
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
};

function CalendarIcon({ className = "h-6 w-6" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="4" width="18" height="17" rx="3" />
            <path d="M16 2v4M8 2v4M3 9h18" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}

function UpcomingDeadlines() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError(false);

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

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch applications"
                    );
                }

                const upcomingApplications = result.data
                    .filter((application) => {
                        if (!application.deadline) {
                            return false;
                        }

                        const daysRemaining = getDaysRemaining(
                            application.deadline
                        );

                        return (
                            daysRemaining >= 0 &&
                            daysRemaining <= 7
                        );
                    })
                    .sort(
                        (a, b) =>
                            new Date(a.deadline) -
                            new Date(b.deadline)
                    );

                setApplications(upcomingApplications);
            } catch (error) {
                console.error(
                    "Failed to fetch upcoming deadlines:",
                    error
                );

                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    return (
        <section className="mt-6 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            {/* Header */}
            <div className="border-b border-slate-100 px-4 py-4 md:px-7 md:py-6">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                        {/* Calendar */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 md:h-14 md:w-14 md:rounded-2xl">
                            <CalendarIcon className="h-4 w-4 md:h-7 md:w-7" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="min-w-0 text-base font-bold leading-tight tracking-tight text-slate-900 md:text-xl">
                                    Upcoming Deadlines
                                </h3>

                                {!loading &&
                                    !error &&
                                    applications.length > 0 && (
                                        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-semibold text-slate-600 md:h-8 md:min-w-8 md:px-2.5 md:text-sm">
                                            {applications.length}
                                        </span>
                                    )}
                            </div>

                            <p className="mt-1 max-w-[180px] text-[11px] leading-4 text-slate-500 md:max-w-none md:text-base md:leading-normal">
                                Deadlines due within the next 7 days.
                            </p>
                        </div>
                    </div>

                    {/* Next 7 Days */}
                    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-2 text-[10px] font-semibold text-blue-700 md:gap-2 md:px-5 md:py-3 md:text-sm">
                        <CalendarIcon className="h-3.5 w-3.5 md:h-5 md:w-5" />

                        <span className="hidden min-[400px]:inline">
                            Next 7 days
                        </span>

                        <span className="min-[400px]:hidden">
                            7 days
                        </span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Loading */}
            {loading && (
                <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-[24px] border border-slate-100 p-5"
                        >
                            <div className="flex justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="h-5 w-32 rounded bg-slate-200" />
                                    <div className="h-4 w-44 rounded bg-slate-100" />
                                </div>

                                <div className="h-8 w-24 rounded-full bg-slate-100" />
                            </div>

                            <div className="mt-8 h-px bg-slate-100" />

                            <div className="mt-5 flex justify-between">
                                <div className="space-y-2">
                                    <div className="h-3 w-16 rounded bg-slate-100" />
                                    <div className="h-5 w-28 rounded bg-slate-200" />
                                </div>

                                <div className="h-10 w-32 rounded-xl bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-lg font-bold text-red-600">
                        !
                    </div>

                    <h4 className="mt-4 font-semibold text-slate-900">
                        Unable to load deadlines
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                        Please refresh the page and try again.
                    </p>
                </div>
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                applications.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <CalendarIcon className="h-7 w-7" />
                        </div>

                        <h4 className="mt-4 font-semibold text-slate-900">
                            No upcoming deadlines
                        </h4>

                        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                            You have no application deadlines
                            coming up in the next 7 days.
                        </p>
                    </div>
                )}

            {/* Deadline Cards */}
            {!loading &&
                !error &&
                applications.length > 0 && (
                    <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
                        {applications.map((application) => {
                            const daysRemaining =
                                getDaysRemaining(
                                    application.deadline
                                );

                            const deadlineStatus =
                                getDeadlineStatus(
                                    daysRemaining
                                );

                            return (
                                <div
                                    key={application._id}
                                    className="group rounded-[24px] border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-6"
                                >
                                    {/* Top */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-4">
                                            {/* Company Avatar */}
                                            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600 sm:flex">
                                                {application.company
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <h4 className="truncate text-lg font-bold text-slate-900">
                                                    {
                                                        application.company
                                                    }
                                                </h4>

                                                <p className="mt-1 truncate text-sm text-slate-500">
                                                    {
                                                        application.position
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <span
                                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold ${deadlineStatus.className}`}
                                        >
                                            {daysRemaining <= 2 && (
                                                <ClockIcon />
                                            )}

                                            {
                                                deadlineStatus.label
                                            }
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-5 border-t border-slate-100" />

                                    {/* Bottom */}
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <CalendarIcon className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                                    Deadline
                                                </p>

                                                <p className="mt-1 text-base font-bold text-slate-900">
                                                    {formatDate(
                                                        application.deadline
                                                    )}
                                                </p>

                                                {daysRemaining ===
                                                    0 && (
                                                        <p className="mt-0.5 text-xs font-medium text-slate-400">
                                                            Today
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <Link
                                            to={`/applications/${application._id}`}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            View Details
                                            <span className="text-base transition-transform group-hover:translate-x-0.5">
                                                →
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
        </section>
    );
}

export default UpcomingDeadlines;