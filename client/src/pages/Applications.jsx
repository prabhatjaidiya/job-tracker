import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [jobTypeFilter, setJobTypeFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");

    // Day 12 - Step 8: Sorting
    const [sortOption, setSortOption] = useState("applied-newest");

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

    useEffect(() => {
        // This effect intentionally performs the initial API request.
        // fetchApplications manages loading/error/application state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // Day 12 - Step 7: Get unique locations
    const locations = [
        ...new Set(
            applications
                .map((application) => application.location?.trim())
                .filter(Boolean)
        ),
    ].sort((a, b) => a.localeCompare(b));

    // Day 12 - Step 10: Clear / Reset
    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setJobTypeFilter("All");
        setLocationFilter("All");
        setSortOption("applied-newest");
    };

    // Day 12 - Search + Status + Job Type + Location Filter
    const filteredApplications = applications.filter((application) => {
        const search = searchTerm.trim().toLowerCase();

        const company = application.company?.toLowerCase() || "";
        const position = application.position?.toLowerCase() || "";
        const location = application.location?.toLowerCase() || "";

        const matchesSearch =
            !search ||
            company.includes(search) ||
            position.includes(search) ||
            location.includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            application.status === statusFilter;

        const matchesJobType =
            jobTypeFilter === "All" ||
            application.jobType === jobTypeFilter;

        const applicationLocation =
            application.location?.trim().toLowerCase() || "";

        const selectedLocation =
            locationFilter.trim().toLowerCase();

        const matchesLocation =
            locationFilter === "All" ||
            applicationLocation === selectedLocation;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesJobType &&
            matchesLocation
        );
    });

    // Day 12 - Step 8: Sort filtered applications
    const sortedApplications = [...filteredApplications].sort(
        (a, b) => {
            switch (sortOption) {
                case "applied-newest":
                    return (
                        new Date(b.appliedDate || 0) -
                        new Date(a.appliedDate || 0)
                    );

                case "applied-oldest":
                    return (
                        new Date(a.appliedDate || 0) -
                        new Date(b.appliedDate || 0)
                    );

                case "deadline-soonest":
                    // Applications without a deadline go to the end.
                    if (!a.deadline && !b.deadline) {
                        return 0;
                    }

                    if (!a.deadline) {
                        return 1;
                    }

                    if (!b.deadline) {
                        return -1;
                    }

                    return (
                        new Date(a.deadline) -
                        new Date(b.deadline)
                    );

                case "deadline-latest":
                    // Applications without a deadline go to the end.
                    if (!a.deadline && !b.deadline) {
                        return 0;
                    }

                    if (!a.deadline) {
                        return 1;
                    }

                    if (!b.deadline) {
                        return -1;
                    }

                    return (
                        new Date(b.deadline) -
                        new Date(a.deadline)
                    );

                case "company-asc":
                    return (a.company || "").localeCompare(
                        b.company || "",
                        undefined,
                        { sensitivity: "base" }
                    );

                case "company-desc":
                    return (b.company || "").localeCompare(
                        a.company || "",
                        undefined,
                        { sensitivity: "base" }
                    );

                case "position-asc":
                    return (a.position || "").localeCompare(
                        b.position || "",
                        undefined,
                        { sensitivity: "base" }
                    );

                case "position-desc":
                    return (b.position || "").localeCompare(
                        a.position || "",
                        undefined,
                        { sensitivity: "base" }
                    );

                default:
                    return 0;
            }
        }
    );

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="w-full">
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
                {error && !loading && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

                            <button
                                type="button"
                                onClick={fetchApplications}
                                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                    {/* Card Header */}

                    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 px-4 py-5 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4">
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

                            {/* Search + Filters */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                                {/* Search */}
                                <div className="relative sm:col-span-2 xl:col-span-1">
                                    <label
                                        htmlFor="application-search"
                                        className="sr-only"
                                    >
                                        Search applications
                                    </label>

                                    <input
                                        id="application-search"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(event) =>
                                            setSearchTerm(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search applications..."
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                    />

                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400">
                                        🔎
                                    </span>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label
                                        htmlFor="status-filter"
                                        className="sr-only"
                                    >
                                        Filter by status
                                    </label>

                                    <select
                                        id="status-filter"
                                        value={statusFilter}
                                        onChange={(event) =>
                                            setStatusFilter(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="All">
                                            All Statuses
                                        </option>

                                        <option value="Applied">
                                            Applied
                                        </option>

                                        <option value="Interview">
                                            Interview
                                        </option>

                                        <option value="Assessment">
                                            Assessment
                                        </option>

                                        <option value="Offer">
                                            Offer
                                        </option>

                                        <option value="Rejected">
                                            Rejected
                                        </option>

                                        <option value="Withdrawn">
                                            Withdrawn
                                        </option>
                                    </select>
                                </div>

                                {/* Job Type Filter */}
                                <div>
                                    <label
                                        htmlFor="job-type-filter"
                                        className="sr-only"
                                    >
                                        Filter by job type
                                    </label>

                                    <select
                                        id="job-type-filter"
                                        value={jobTypeFilter}
                                        onChange={(event) =>
                                            setJobTypeFilter(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="All">
                                            All Job Types
                                        </option>

                                        <option value="Full-time">
                                            Full-time
                                        </option>

                                        <option value="Part-time">
                                            Part-time
                                        </option>

                                        <option value="Internship">
                                            Internship
                                        </option>

                                        <option value="Contract">
                                            Contract
                                        </option>

                                        <option value="Freelance">
                                            Freelance
                                        </option>
                                    </select>
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label
                                        htmlFor="location-filter"
                                        className="sr-only"
                                    >
                                        Filter by location
                                    </label>

                                    <select
                                        id="location-filter"
                                        value={locationFilter}
                                        onChange={(event) =>
                                            setLocationFilter(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="All">
                                            All Locations
                                        </option>

                                        {locations.map((location) => (
                                            <option
                                                key={location}
                                                value={location}
                                            >
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label
                                        htmlFor="sort-filter"
                                        className="sr-only"
                                    >
                                        Sort applications
                                    </label>

                                    <select
                                        id="sort-filter"
                                        value={sortOption}
                                        onChange={(event) =>
                                            setSortOption(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="applied-newest">
                                            Applied Date — Newest
                                        </option>

                                        <option value="applied-oldest">
                                            Applied Date — Oldest
                                        </option>

                                        <option value="deadline-soonest">
                                            Deadline — Soonest
                                        </option>

                                        <option value="deadline-latest">
                                            Deadline — Latest
                                        </option>

                                        <option value="company-asc">
                                            Company — A to Z
                                        </option>

                                        <option value="company-desc">
                                            Company — Z to A
                                        </option>

                                        <option value="position-asc">
                                            Position — A to Z
                                        </option>

                                        <option value="position-desc">
                                            Position — Z to A
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Clear / Reset */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <span>↻</span>
                                    Clear Filters
                                </button>
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
                    ) : error ? (
                        <div className="p-8 sm:p-12">
                            <div className="mx-auto max-w-md text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
                                    !
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-900">
                                    Unable to load applications
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    We couldn't load your applications. Please try again.
                                </p>

                                <button
                                    type="button"
                                    onClick={fetchApplications}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                                >
                                    Try Again
                                </button>
                            </div>
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
                    ) : sortedApplications.length === 0 ? (
                        /* Filter No Results */
                        <div className="p-8 sm:p-12">
                            <div className="mx-auto max-w-md text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                                    🔎
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-900">
                                    No matching applications
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    No applications match your
                                    search or selected filters.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Application List */
                        <div className="divide-y divide-slate-100">
                            {sortedApplications.map((application) => {
                                const statusStyles =
                                    getStatusStyles(application.status);

                                return (
                                    <div
                                        key={application._id}
                                        className="group relative p-4 transition duration-200 hover:bg-slate-50/70 sm:p-5 lg:p-6"
                                    >
                                        {/* Status Accent */}
                                        <div
                                            className={`absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b ${statusStyles.accent} opacity-0 transition group-hover:opacity-100`}
                                        />


                                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                                            {/* Company + Position */}
                                            <div className="flex min-w-0 items-start gap-4">
                                                <div
                                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${statusStyles.accent} text-lg font-bold text-white shadow-sm`}
                                                >
                                                    {getCompanyInitial(application.company)}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="break-words text-base font-bold text-slate-900 sm:text-lg">
                                                        {application.position}
                                                    </h3>

                                                    <p className="mt-1 break-words text-sm font-medium text-slate-500">
                                                        {application.company}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        {application.location && (
                                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                📍 {application.location}
                                                            </span>
                                                        )}

                                                        {application.jobType && (
                                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                💼 {application.jobType}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Status + Dates + View Details */}
                                            <div className="grid grid-cols-2 items-center gap-4 sm:grid-cols-4 sm:gap-3">

                                                {/* Status */}
                                                <div className="col-span-2 min-w-0 sm:col-span-1">
                                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Status
                                                    </p>

                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles.badge}`}
                                                    >
                                                        <span
                                                            className={`h-2 w-2 shrink-0 rounded-full ${statusStyles.dot}`}
                                                        />
                                                        {application.status}
                                                    </span>
                                                </div>

                                                {/* Applied Date */}
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Applied
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                                        {formatDate(application.appliedDate)}
                                                    </p>
                                                </div>

                                                {/* Deadline */}
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Deadline
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                                        {formatDate(application.deadline)}
                                                    </p>
                                                </div>

                                                {/* View Details */}
                                                <Link
                                                    to={`/applications/${application._id}`}
                                                    className="col-span-2 inline-flex min-h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-1"
                                                >
                                                    View Details →
                                                </Link>
                                            </div>
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