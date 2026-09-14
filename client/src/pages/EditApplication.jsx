import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditApplication() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        company: "",
        position: "",
        location: "",
        jobType: "",
        salary: "",
        status: "",
        appliedDate: "",
        deadline: "",
        jobUrl: "",
        description: "",
        notes: "",
        contact: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchApplication = async () => {
            setLoading(true);
            setApiError("");

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/applications/${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setApiError(
                        data.message || "Failed to fetch application."
                    );
                    return;
                }

                const application = data.data;

                setFormData({
                    company: application.company || "",
                    position: application.position || "",
                    location: application.location || "",
                    jobType: application.jobType || "",
                    salary: application.salary ?? "",
                    status: application.status || "",
                    appliedDate: application.appliedDate
                        ? application.appliedDate.slice(0, 10)
                        : "",
                    deadline: application.deadline
                        ? application.deadline.slice(0, 10)
                        : "",
                    jobUrl: application.jobUrl || "",
                    description: application.description || "",
                    notes: application.notes || "",
                    contact: application.contact || "",
                });
            } catch (error) {
                console.error("Failed to fetch application:", error);
                setApiError("Unable to connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company.trim()) {
            newErrors.company = "Company is required";
        }

        if (!formData.position.trim()) {
            newErrors.position = "Position is required";
        }

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        }

        if (!formData.jobType) {
            newErrors.jobType = "Job Type is required";
        }

        if (!formData.status) {
            newErrors.status = "Status is required";
        }

        if (!formData.jobUrl.trim()) {
            newErrors.jobUrl = "Job URL is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((previousErrors) => ({
                ...previousErrors,
                [name]: "",
            }));
        }

        setApiError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setApiError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/applications/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        jobUrl: formData.jobUrl.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setApiError(
                    data.message || "Failed to update application."
                );
                return;
            }

            setSuccess("Application updated successfully.");

            setTimeout(() => {
                navigate(`/applications/${id}`);
            }, 800);
        } catch (error) {
            console.error("Failed to update application:", error);
            setApiError("Unable to connect to the server.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = (field) => {
        return `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${errors[field]
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            }`;
    };

    if (loading) {
        return (
            <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl">
                    <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

                    <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="h-40 animate-pulse bg-slate-200" />

                        <div className="space-y-4 p-6 sm:p-8">
                            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
                            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (apiError && !formData.company) {
        return (
            <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <p className="font-medium text-red-700">
                            {apiError}
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

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    to={`/applications/${id}`}
                    className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <span className="transition-transform group-hover:-translate-x-1">
                        ←
                    </span>

                    Application Details
                </Link>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-8 sm:px-8 sm:py-10">
                        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10" />
                        <div className="absolute -bottom-28 right-48 h-52 w-52 rounded-full bg-white/5" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-lg">
                                ✎
                            </div>

                            <div className="text-white">
                                <p className="text-sm font-medium text-white/70">
                                    Job Tracker
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                                    Edit Application
                                </h1>

                                <p className="mt-1 text-sm text-white/75">
                                    Update your application information.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 sm:p-8"
                    >
                        {success && (
                            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-600">
                                        ✓
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-emerald-800">
                                            Application updated
                                        </p>

                                        <p className="mt-1 text-sm text-emerald-700">
                                            {success}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {apiError && (
                            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 font-bold text-red-600">
                                        !
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-red-800">
                                            Unable to update application
                                        </p>

                                        <p className="mt-1 text-sm text-red-700">
                                            {apiError}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Basic Information */}
                        <section>
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    💼
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                                        Step 01
                                    </p>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Basic Information
                                    </h2>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="company"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Company{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className={inputClass("company")}
                                    />

                                    {errors.company && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {errors.company}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="position"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Position{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        id="position"
                                        name="position"
                                        type="text"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className={inputClass("position")}
                                    />

                                    {errors.position && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {errors.position}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="location"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Location{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={inputClass("location")}
                                    />

                                    {errors.location && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="jobType"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Job Type{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        id="jobType"
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className={inputClass("jobType")}
                                    >
                                        <option value="" disabled>
                                            Select job type
                                        </option>
                                        <option value="Full-time">
                                            Full-time
                                        </option>
                                        <option value="Internship">
                                            Internship
                                        </option>
                                        <option value="Part-time">
                                            Part-time
                                        </option>
                                        <option value="Contract">
                                            Contract
                                        </option>
                                    </select>

                                    {errors.jobType && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {errors.jobType}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Status */}
                        <section className="mt-10 border-t border-slate-100 pt-8">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                    ◉
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">
                                        Step 02
                                    </p>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Application Status
                                    </h2>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Current Status{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={inputClass("status")}
                                    >
                                        <option value="" disabled>
                                            Select status
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

                                    {errors.status && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="salary"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Salary
                                    </label>

                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                                            ₹
                                        </span>

                                        <input
                                            id="salary"
                                            name="salary"
                                            type="number"
                                            min="0"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            className={`${inputClass(
                                                "salary"
                                            )} pl-9`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Dates */}
                        <section className="mt-10 border-t border-slate-100 pt-8">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                    📅
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                                        Step 03
                                    </p>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Important Dates
                                    </h2>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                                    <label
                                        htmlFor="appliedDate"
                                        className="text-sm font-semibold text-blue-700"
                                    >
                                        Application Date
                                    </label>

                                    <input
                                        id="appliedDate"
                                        name="appliedDate"
                                        type="date"
                                        value={formData.appliedDate}
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                                    <label
                                        htmlFor="deadline"
                                        className="text-sm font-semibold text-rose-700"
                                    >
                                        Deadline
                                    </label>

                                    <input
                                        id="deadline"
                                        name="deadline"
                                        type="date"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Job URL */}
                        <section className="mt-10 border-t border-slate-100 pt-8">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                    ↗
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                                        Step 04
                                    </p>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Job Posting
                                    </h2>
                                </div>
                            </div>

                            <label
                                htmlFor="jobUrl"
                                className="text-sm font-semibold text-slate-700"
                            >
                                Job URL{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="jobUrl"
                                name="jobUrl"
                                type="url"
                                placeholder="https://example.com/job"
                                value={formData.jobUrl}
                                onChange={handleChange}
                                className={inputClass("jobUrl")}
                            />

                            {errors.jobUrl && (
                                <p className="mt-2 text-xs font-medium text-red-600">
                                    {errors.jobUrl}
                                </p>
                            )}
                        </section>

                        {/* Additional Information */}
                        <section className="mt-10 border-t border-slate-100 pt-8">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                    ✦
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                                        Step 05
                                    </p>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Additional Information
                                    </h2>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Job Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="5"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={inputClass("description")}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="notes"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Personal Notes
                                    </label>

                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows="5"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className={inputClass("notes")}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Contact
                                    </label>

                                    <input
                                        id="contact"
                                        name="contact"
                                        type="text"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className={inputClass("contact")}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                to={`/applications/${id}`}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span>✓</span>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="py-6 text-center text-xs text-slate-400">
                    Keep your application information up to date.
                </p>
            </div>
        </div>
    );
}

export default EditApplication;