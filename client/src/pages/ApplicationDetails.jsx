import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";

function ApplicationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [notes, setNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [notesMessage, setNotesMessage] = useState("");
    const [activities, setActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);
    const [activitiesError, setActivitiesError] = useState("");
    const [activityType, setActivityType] = useState(
        "APPLICATION_UPDATED"
    );
    const [activityDescription, setActivityDescription] = useState("");
    const [addingActivity, setAddingActivity] = useState(false);
    const [activityMessage, setActivityMessage] = useState("");

    useEffect(() => {
        const fetchApplication = async () => {
            setLoading(true);
            setError("");

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_BASE_URL}/applications/${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Application not found.");
                    } else {
                        setError(
                            data.message || "Failed to fetch application."
                        );
                    }

                    return;
                }

                setApplication(data.data);
                setNotes(data.data.notes || "");
            } catch (error) {
                setError("Unable to connect to the server.");
                console.error(
                    "Failed to fetch application:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

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

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/applications/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || "Failed to delete application."
                );
                return;
            }

            navigate("/applications");
        } catch (error) {
            console.error("Failed to delete application:", error);
            setError("Unable to connect to the server.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSaveNotes = async () => {
        setSavingNotes(true);
        setNotesMessage("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/applications/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        notes,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setNotesMessage(
                    data.message || "Failed to save notes."
                );
                return;
            }

            setApplication((previousApplication) => ({
                ...previousApplication,
                notes,
            }));

            setNotesMessage("Notes saved.");
        } catch (error) {
            console.error("Failed to save notes:", error);
            setNotesMessage("Unable to connect to the server.");
        } finally {
            setSavingNotes(false);
        }
    };

    const fetchActivities = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/applications/${id}/activities`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setActivitiesError(
                    data.message || "Failed to fetch activities."
                );
                return;
            }

            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities:", error);
            setActivitiesError("Unable to connect to the server.");
        } finally {
            setActivitiesLoading(false);
        }
    }, [id]);

    const handleAddActivity = async () => {
        if (!activityDescription.trim()) {
            setActivityMessage("Activity description is required.");
            return;
        }

        setAddingActivity(true);
        setActivityMessage("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/applications/${id}/activities`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        type: activityType,
                        description: activityDescription.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setActivityMessage(
                    data.message || "Failed to add activity."
                );
                return;
            }

            setActivityDescription("");
            setActivityMessage("Activity added successfully.");

            await fetchActivities();
        } catch (error) {
            console.error("Failed to add activity:", error);
            setActivityMessage("Unable to connect to the server.");
        } finally {
            setAddingActivity(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        const loadActivities = async () => {
            await fetchActivities();
        };

        loadActivities();
    }, [id, fetchActivities]);

    if (loading) {
        return (
            <div className="min-h-full w-full overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

                    <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="h-40 animate-pulse bg-slate-200" />

                        <div className="space-y-4 p-6 sm:p-8">
                            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
                            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <p className="font-medium text-red-700">
                            {error}
                        </p>

                        <Link
                            to="/applications"
                            className="mt-4 inline-flex font-medium text-red-700 hover:underline"
                        >
                            ← Back to Applications
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-slate-500">
                        Application not found.
                    </p>

                    <Link
                        to="/applications"
                        className="mt-4 inline-flex font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Applications
                    </Link>
                </div>
            </div>
        );
    }

    const statusStyles = getStatusStyles(application.status);

    return (
        <div className="min-h-full w-full overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">
                {/* Back Navigation */}
                <Link
                    to="/applications"
                    className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <span className="transition-transform group-hover:-translate-x-1">
                        ←
                    </span>

                    Applications
                </Link>

                {/* Main Application Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                    {/* Color Header */}
                    <div
                        className={`relative overflow-hidden bg-gradient-to-r ${statusStyles.accent} px-6 py-8 sm:px-8 sm:py-10`}
                    >
                        {/* Decorative circles */}
                        <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-white/10" />
                        <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/5" />

                        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                {/* Company Avatar */}
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-slate-800 shadow-lg sm:h-20 sm:w-20 sm:text-3xl">
                                    {getCompanyInitial(
                                        application.company
                                    )}
                                </div>

                                <div className="min-w-0 text-white">
                                    <p className="mb-1 text-sm font-medium text-white/70">
                                        Job Application
                                    </p>

                                    <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                                        {application.position}
                                    </h1>

                                    <p className="mt-1 break-words text-base font-medium text-white/80">
                                        {application.company}
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
                                <Link
                                    to={`/applications/${id}/edit`}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-md transition hover:-translate-y-0.5 hover:bg-slate-50 sm:px-4"
                                >
                                    <span>✎</span>
                                    Edit
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-md transition hover:-translate-y-0.5 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deleting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <span>🗑</span>
                                            Delete
                                        </>
                                    )}
                                </button>

                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-md">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${statusStyles.dot}`}
                                    />
                                    {application.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        {/* Quick Stats */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Location */}
                            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    📍
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Location
                                </p>

                                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                                    {application.location || "—"}
                                </p>
                            </div>

                            {/* Job Type */}
                            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/50 hover:shadow-sm">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                    💼
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Job Type
                                </p>

                                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                                    {application.jobType || "—"}
                                </p>
                            </div>

                            {/* Salary */}
                            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-sm">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                    ₹
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Salary
                                </p>

                                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                                    {application.salary
                                        ? `₹${application.salary}`
                                        : "—"}
                                </p>
                            </div>

                            {/* Contact */}
                            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-sm">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                    ✉
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Contact
                                </p>

                                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                                    {application.contact || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg">
                                        📅
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                                            Applied On
                                        </p>

                                        <p className="mt-1 text-base font-bold text-slate-900">
                                            {formatDate(
                                                application.appliedDate
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-lg">
                                        ⏰
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                                            Deadline
                                        </p>

                                        <p className="mt-1 text-base font-bold text-slate-900">
                                            {formatDate(
                                                application.deadline
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Posting */}
                        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                            <div className="flex flex-col gap-4 bg-gradient-to-r from-slate-50 to-blue-50/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                                        Job Posting
                                    </p>

                                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                                        Original Job Listing
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Open the original posting in a new tab.
                                    </p>
                                </div>

                                {application.jobUrl ? (
                                    <a
                                        href={application.jobUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md"
                                    >
                                        View Job Posting
                                        <span>↗</span>
                                    </a>
                                ) : (
                                    <span className="text-sm text-slate-400">
                                        No URL provided
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description & Notes */}
                        <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            {/* Description */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        ≡
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Role
                                        </p>

                                        <h2 className="font-bold text-slate-900">
                                            Description
                                        </h2>
                                    </div>
                                </div>

                                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                                    {application.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            {/* Notes */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        ✦
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Personal
                                        </p>

                                        <h2 className="font-bold text-slate-900">
                                            Notes
                                        </h2>
                                    </div>
                                </div>

                                <textarea
                                    value={notes}
                                    onChange={(event) => {
                                        setNotes(event.target.value);
                                        setNotesMessage("");
                                    }}
                                    placeholder="Add notes about this application..."
                                    rows={6}
                                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                                />

                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-sm">
                                        {notesMessage && (
                                            <p
                                                className={
                                                    notesMessage === "Notes saved."
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {notesMessage}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSaveNotes}
                                        disabled={savingNotes}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {savingNotes ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <span>✓</span>
                                                Save Notes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Activity Timeline */}
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                    ↗
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        History
                                    </p>

                                    <h2 className="font-bold text-slate-900">
                                        Activity
                                    </h2>
                                </div>
                            </div>

                            {/* Add Activity Form */}
                            <div className="mb-8 w-full min-w-0 rounded-2xl border border-violet-100 bg-violet-50/40 p-4 sm:p-5">
                                <div className="mb-4">
                                    <p className="text-sm font-bold text-slate-900">
                                        Add Activity
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Record something that happened with this application.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    {/* Activity Type */}
                                    <div>
                                        <label
                                            htmlFor="activityType"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                        >
                                            Activity Type
                                        </label>

                                        <select
                                            id="activityType"
                                            value={activityType}
                                            onChange={(event) =>
                                                setActivityType(event.target.value)
                                            }
                                            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                        >
                                            <option value="APPLICATION_CREATED">
                                                Application Created
                                            </option>

                                            <option value="STATUS_CHANGE">
                                                Status Changed
                                            </option>

                                            <option value="APPLICATION_UPDATED">
                                                Application Updated
                                            </option>

                                            <option value="NOTE_ADDED">
                                                Note Added
                                            </option>
                                        </select>
                                    </div>

                                    {/* Activity Description */}
                                    <div>
                                        <label
                                            htmlFor="activityDescription"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            id="activityDescription"
                                            value={activityDescription}
                                            onChange={(event) => {
                                                setActivityDescription(event.target.value);
                                                setActivityMessage("");
                                            }}
                                            placeholder="e.g. Recruiter called about the interview."
                                            rows={4}
                                            className="w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                        />
                                    </div>

                                    {/* Message + Button */}
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            {activityMessage && (
                                                <p
                                                    className={
                                                        activityMessage ===
                                                            "Activity added successfully."
                                                            ? "text-sm text-emerald-600"
                                                            : "text-sm text-red-600"
                                                    }
                                                >
                                                    {activityMessage}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddActivity}
                                            disabled={addingActivity}
                                            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                        >
                                            {addingActivity ? (
                                                <>
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <span>+</span>
                                                    Add Activity
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {activitiesLoading ? (
                                <div className="space-y-5">
                                    <div className="flex gap-4">
                                        <div className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-slate-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                                            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-slate-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                                            <div className="h-3 w-1/4 animate-pulse rounded bg-slate-100" />
                                        </div>
                                    </div>
                                </div>
                            ) : activitiesError ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                    <p className="text-sm font-medium text-red-700">
                                        {activitiesError}
                                    </p>
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                                    <p className="text-sm font-medium text-slate-500">
                                        No activity yet.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Activity related to this application will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute bottom-0 left-[5px] top-0 w-px bg-slate-200" />

                                    <div className="space-y-6">
                                        {activities.map((activity) => (
                                            <div
                                                key={activity._id}
                                                className="relative flex min-w-0 gap-3 sm:gap-4"
                                            >
                                                {/* Timeline dot */}
                                                <div className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full bg-violet-500 ring-4 ring-white" />

                                                {/* Activity content */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="break-words text-sm font-semibold text-slate-900">
                                                        {activity.description}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {new Date(
                                                            activity.createdAt
                                                        ).toLocaleString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="py-6 text-center">
                    <Link
                        to="/applications"
                        className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
                    >
                        ← Back to all applications
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ApplicationDetails;