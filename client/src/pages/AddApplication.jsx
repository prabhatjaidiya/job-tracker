import { useState } from "react";
import { Link } from "react-router-dom";

function AddApplication() {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [apiError, setApiError] = useState("");

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError("");
        setSuccess("");

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/applications",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setApiError(
                    data.message ||
                    "Failed to create application."
                );
                return;
            }

            setSuccess("Application added successfully.");
        } catch (error) {
            setApiError("Unable to connect to the server.");
            console.error(
                "Failed to create application:",
                error
            );
        } finally {
            setLoading(false);
        }
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
    };

    const inputClass = (field) => {
        return `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 ${errors[field]
            ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/10"
            : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/10"
            }`;
    };

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">

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

                {/* Main Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">

                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-8 sm:px-8 sm:py-10">
                        {/* Decorative shapes */}
                        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10" />
                        <div className="absolute -bottom-28 right-48 h-52 w-52 rounded-full bg-white/5" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-lg">
                                +
                            </div>

                            <div className="text-white">
                                <p className="text-sm font-medium text-white/70">
                                    Job Tracker
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                                    Add Application
                                </h1>

                                <p className="mt-1 text-sm text-white/75">
                                    Track a new opportunity in your job
                                    search.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        className="p-6 sm:p-8"
                        onSubmit={handleSubmit}
                    >
                        {/* Success */}
                        {success && (
                            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-600">
                                        ✓
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-emerald-800">
                                            Application added
                                        </p>

                                        <p className="mt-1 text-sm text-emerald-700">
                                            {success}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* API Error */}
                        {apiError && (
                            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 font-bold text-red-600">
                                        !
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-red-800">
                                            Unable to add application
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
                                {/* Company */}
                                <div>
                                    <label
                                        htmlFor="company"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Company{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        placeholder="e.g. Google"
                                        value={formData.company}
                                        onChange={handleChange}
                                        aria-invalid={Boolean(errors.company)}
                                        aria-describedby={errors.company ? "company-error" : undefined}
                                        className={inputClass(
                                            "company"
                                        )}
                                    />

                                    {errors.company && (
                                        <p
                                            id="company-error"
                                            className="mt-2 text-xs font-medium text-red-600"
                                        >
                                            {errors.company}
                                        </p>
                                    )}
                                </div>

                                {/* Position */}
                                <div>
                                    <label
                                        htmlFor="position"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Position{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="position"
                                        name="position"
                                        type="text"
                                        placeholder="e.g. Frontend Developer"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className={inputClass(
                                            "position"
                                        )}
                                    />

                                    {errors.position && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {errors.position}
                                        </p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label
                                        htmlFor="location"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Location{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        placeholder="e.g. Bangalore / Remote"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={inputClass(
                                            "location"
                                        )}
                                    />

                                    {errors.location && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>

                                {/* Job Type */}
                                <div>
                                    <label
                                        htmlFor="jobType"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Job Type{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="jobType"
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className={inputClass(
                                            "jobType"
                                        )}
                                    >
                                        <option
                                            value=""
                                            disabled
                                        >
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

                        {/* Application Status */}
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
                                {/* Status */}
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Current Status{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={inputClass(
                                            "status"
                                        )}
                                    >
                                        <option
                                            value=""
                                            disabled
                                        >
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

                                {/* Salary */}
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
                                            placeholder="e.g. 800000"
                                            value={
                                                formData.salary
                                            }
                                            onChange={
                                                handleChange
                                            }
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
                                        value={
                                            formData.appliedDate
                                        }
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
                                        value={
                                            formData.deadline
                                        }
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Job Posting */}
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
                                <span className="text-red-500">
                                    *
                                </span>
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

                        {/* Description & Notes */}
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
                                {/* Description */}
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
                                        placeholder="Add the job description or important requirements..."
                                        value={
                                            formData.description
                                        }
                                        onChange={handleChange}
                                        className={inputClass(
                                            "description"
                                        )}
                                    />
                                </div>

                                {/* Notes */}
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
                                        placeholder="Add your notes, preparation points, or follow-up reminders..."
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className={inputClass(
                                            "notes"
                                        )}
                                    />
                                </div>

                                {/* Contact */}
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
                                        placeholder="e.g. recruiter@example.com"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className={inputClass(
                                            "contact"
                                        )}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                to="/applications"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <span>+</span>
                                        Add Application
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="py-6 text-center text-xs text-slate-400">
                    Keep your job search organized, one application
                    at a time.
                </p>
            </div>
        </div>
    );
}

export default AddApplication;