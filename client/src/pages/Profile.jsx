import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

const Profile = () => {
    const { user, setUser, loading } = useAuth();

    // Applications
    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applicationsError, setApplicationsError] = useState("");

    // Edit profile
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    // Change password
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    // Profile photo
    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [photoSaving, setPhotoSaving] = useState(false);
    const [photoError, setPhotoError] = useState("");
    const [photoSuccess, setPhotoSuccess] = useState("");

    // Keep edit fields synchronized with authenticated user.
    useEffect(() => {
        if (!user) return;

        setName(user.name || "");
        setEmail(user.email || "");
    }, [user]);

    // Fetch user's applications.
    useEffect(() => {
        if (!user) {
            setApplications([]);
            setApplicationsLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchApplications = async () => {
            setApplicationsLoading(true);
            setApplicationsError("");

            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setApplications([]);
                    setApplicationsError(
                        "Please log in to view your applications."
                    );
                    return;
                }

                const response = await fetch(`${API_URL}/applications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(
                        response.status === 401
                            ? "Your session has expired. Please log in again."
                            : "Could not load application statistics."
                    );
                }

                const data = await response.json();

                const applicationsData = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.applications)
                            ? data.applications
                            : [];

                setApplications(applicationsData);
            } catch (error) {
                if (error.name === "AbortError") return;

                console.error("Profile applications error:", error);
                setApplications([]);
                setApplicationsError(
                    error.message || "Failed to load applications."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setApplicationsLoading(false);
                }
            }
        };

        fetchApplications();

        return () => controller.abort();
    }, [user]);

    // Application statistics.
    const stats = useMemo(() => {
        const activeStatuses = [
            "applied",
            "interview",
            "assessment",
            "in progress",
        ];

        const responseStatuses = [
            "interview",
            "offer",
            "rejected",
        ];

        const active = applications.filter((application) =>
            activeStatuses.includes(
                String(application.status || "").toLowerCase()
            )
        ).length;

        const responses = applications.filter((application) =>
            responseStatuses.includes(
                String(application.status || "").toLowerCase()
            )
        ).length;

        return {
            total: applications.length,
            active,
            responseRate: applications.length
                ? Math.round((responses / applications.length) * 100)
                : 0,
        };
    }, [applications]);

    // Edit profile modal handlers.
    const openEditModal = () => {
        setName(user?.name || "");
        setEmail(user?.email || "");
        setFormError("");
        setFormSuccess("");
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        if (saving) return;

        setIsEditOpen(false);
        setFormError("");
    };

    // Update profile.
    const handleProfileUpdate = async (event) => {
        event.preventDefault();

        setFormError("");
        setFormSuccess("");

        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!trimmedName || !normalizedEmail) {
            setFormError("Name and email are required.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            setFormError("Please enter a valid email address.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setFormError(
                "Your session has expired. Please log in again."
            );
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: trimmedName,
                    email: normalizedEmail,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update your profile."
                );
            }

            if (!data.user) {
                throw new Error(
                    "Profile was updated, but the server did not return user details."
                );
            }

            setUser?.(data.user);

            setFormSuccess("Your profile has been updated.");
            setIsEditOpen(false);
        } catch (error) {
            console.error("Profile update error:", error);
            setFormError(error.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    // Change password modal handlers.
    const openPasswordModal = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setPasswordSuccess("");
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        if (passwordSaving) return;

        setIsPasswordModalOpen(false);
        setPasswordError("");
    };

    // Change password.
    const handleChangePassword = async (event) => {
        event.preventDefault();

        setPasswordError("");
        setPasswordSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Please fill in all password fields.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordError(
                "New password must be different from your current password."
            );
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setPasswordError(
                "Your session has expired. Please log in again."
            );
            return;
        }

        setPasswordSaving(true);

        try {
            const response = await fetch(
                `${API_URL}/auth/change-password`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to change your password."
                );
            }

            setPasswordSuccess(
                data.message || "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsPasswordModalOpen(false);
        } catch (error) {
            console.error("Change password error:", error);
            setPasswordError(
                error.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setPasswordSaving(false);
        }
    };

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
        })
        : "—";

    const handlePhotoUpload = async (event) => {
        const file = event.target.files?.[0];

        // Allow selecting the same file again later.
        event.target.value = "";

        if (!file) return;

        setPhotoError("");
        setPhotoSuccess("");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setPhotoError("Please select a JPG, PNG, or WebP image.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setPhotoError("Image size must be less than 2 MB.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setPhotoError("Please log in again.");
            return;
        }

        setPhotoSaving(true);

        try {
            const formData = new FormData();
            formData.append("profilePhoto", file);

            const response = await fetch(
                `${API_URL}/auth/profile/photo`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to upload profile photo."
                );
            }

            if (!data.user) {
                throw new Error("Server did not return updated user details.");
            }

            setUser?.(data.user);
            setPhotoPreview("");
            setPhotoSuccess("Profile photo updated successfully.");
        } catch (error) {
            console.error("Profile photo upload error:", error);
            setPhotoError(error.message || "Something went wrong.");
        } finally {
            setPhotoSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="grid min-h-[50vh] place-items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-white p-6 text-rose-600">
                Unable to load your profile. Please log in again.
            </div>
        );
    }

    const displayName = user.name || "Job Seeker";
    const displayEmail = user.email || "No email available";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="mx-auto w-full max-w-[1600px] space-y-7 p-6 md:p-8">
            {/* Page heading */}
            <div>
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-indigo-600">⌂</span>
                    <span>/</span>
                    <span className="font-medium text-slate-600">
                        Profile
                    </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Profile
                </h1>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    Manage your account information and preferences
                </p>
            </div>

            {/* Success messages */}
            {formSuccess && (
                <div
                    role="status"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                >
                    {formSuccess}
                </div>
            )}

            {passwordSuccess && (
                <div
                    role="status"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                >
                    {passwordSuccess}
                </div>
            )}

            {photoError && (
                <div
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                    {photoError}
                </div>
            )}

            {photoSuccess && (
                <div
                    role="status"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                >
                    {photoSuccess}
                </div>
            )}

            {/* Main grid */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.55fr_1fr]">
                {/* Left column */}
                <div className="min-w-0 space-y-5">
                    {/* Profile hero */}
                    <section className="relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                        {/* Background decoration */}
                        <div className="pointer-events-none absolute -right-10 -top-28 -z-10 h-64 w-64 rounded-full bg-indigo-100/70 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-48 w-48 rounded-full bg-fuchsia-100/70 blur-3xl" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">

                            {/* Photo + User Details */}
                            <div className="flex min-w-0 items-center gap-4 sm:flex-1 sm:gap-6">

                                {/* Profile Photo */}
                                <div className="flex shrink-0 flex-col items-center gap-2 sm:gap-3">
                                    <div className="relative h-16 w-16 sm:h-24 sm:w-24">
                                        {user.profilePhoto ? (
                                            <img
                                                src={user.profilePhoto}
                                                alt={`${displayName}'s profile`}
                                                className="h-full w-full rounded-full border-2 border-white object-cover shadow-lg"
                                            />
                                        ) : (
                                            <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-2xl font-bold text-white shadow-lg shadow-violet-200 sm:text-4xl">
                                                {initial}
                                            </div>
                                        )}

                                        <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500 sm:h-5 sm:w-5" />
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        disabled={photoSaving}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={photoSaving}
                                        className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:py-2 sm:text-xs"
                                    >
                                        {photoSaving
                                            ? "Uploading..."
                                            : user.profilePhoto
                                                ? "Change Photo"
                                                : "Upload Photo"}
                                    </button>
                                </div>

                                {/* User Details */}
                                <div className="min-w-0 flex-1">
                                    <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                                        {displayName}
                                    </h2>

                                    <p className="mt-1 break-all text-sm text-slate-500 sm:mt-2 sm:text-base">
                                        {displayEmail}
                                    </p>

                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 sm:mt-4 sm:px-3 sm:text-xs">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Active Account
                                    </div>
                                </div>
                            </div>

                            {/* Edit Profile */}
                            <button
                                type="button"
                                onClick={openEditModal}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto sm:shrink-0"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    aria-hidden="true"
                                >
                                    <path d="m14 6 4 4M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" />
                                </svg>
                                Edit Profile
                            </button>
                        </div>
                    </section>

                    {/* Account information */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-center gap-4">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="8" r="3.5" />
                                    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Account Information
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Your personal details
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="grid grid-cols-[32px_1fr] items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 sm:grid-cols-[32px_1fr_1.8fr]">
                                <span className="text-slate-600">♙</span>
                                <span className="text-sm font-medium text-slate-600">
                                    Full Name
                                </span>
                                <span className="col-span-2 break-words text-sm font-semibold text-slate-900 sm:col-span-1">
                                    {displayName}
                                </span>
                            </div>

                            <div className="grid grid-cols-[32px_1fr] items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 sm:grid-cols-[32px_1fr_1.8fr]">
                                <span className="text-slate-600">✉</span>
                                <span className="text-sm font-medium text-slate-600">
                                    Email Address
                                </span>
                                <span className="col-span-2 break-all text-sm font-semibold text-slate-900 sm:col-span-1">
                                    {displayEmail}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Account security */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-center gap-4">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    aria-hidden="true"
                                >
                                    <rect x="5" y="10" width="14" height="11" rx="2" />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    <path d="M12 14v3" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Account Security
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Keep your account secure
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-semibold text-slate-800">
                                    Password
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Update your password regularly.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openPasswordModal}
                                disabled={passwordSaving}
                                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Change Password
                            </button>
                        </div>
                    </section>
                </div>

                {/* Right column */}
                <div className="min-w-0 space-y-5">
                    {/* Profile summary */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    aria-hidden="true"
                                >
                                    <path d="M4 19h16M6 16v-5h4v5M14 16V5h4v11" />
                                    <path d="m6 8 4-3 4 2 4-4" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Profile Summary
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Your activity overview
                                </p>
                            </div>
                        </div>

                        {applicationsError && (
                            <p
                                role="alert"
                                className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700"
                            >
                                {applicationsError}
                            </p>
                        )}

                        <div className="mt-6 grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                            {/* Total applications */}
                            <div className="flex items-center justify-between gap-3 py-4 sm:px-3 sm:py-2">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Total Applications
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {applicationsLoading ? "—" : stats.total}
                                    </p>
                                </div>
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <span>▤</span>
                                </div>
                            </div>

                            {/* Active applications */}
                            <div className="flex items-center justify-between gap-3 py-4 sm:px-3 sm:py-2">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Active Applications
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {applicationsLoading ? "—" : stats.active}
                                    </p>
                                </div>
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                                    <span>◷</span>
                                </div>
                            </div>

                            {/* Response rate */}
                            <div className="flex items-center justify-between gap-3 py-4 sm:px-3 sm:py-2">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Response Rate
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {applicationsLoading
                                            ? "—"
                                            : `${stats.responseRate}%`}
                                    </p>
                                </div>
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <span>↗</span>
                                </div>
                            </div>

                            {/* Member since */}
                            <div className="flex items-center justify-between gap-3 py-4 sm:px-3 sm:py-2">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Member Since
                                    </p>
                                    <p className="mt-2 text-lg font-bold text-slate-900">
                                        {memberSince}
                                    </p>
                                </div>
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600">
                                    <span>♙</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Motivation card */}
                    <section className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-amber-500 shadow-sm">
                                ✦
                            </div>
                            <h3 className="font-bold text-slate-900">
                                Keep Going!
                            </h3>
                        </div>

                        <p className="mt-5 text-sm leading-6 text-slate-600">
                            Every application you submit is a step closer to
                            your next opportunity. Stay consistent and keep
                            building your future.
                        </p>
                    </section>

                    {/* Support card */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <span className="text-xl">?</span>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Need Help?
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Need to update your information or having
                                    account issues? Get in touch with support.
                                </p>
                            </div>
                        </div>

                        <a
                            href="mailto:jobtrackerofficial25@gmail.com"
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            Contact Support
                        </a>
                    </section>
                </div>
            </div>

            {/* Change password modal */}
            {isPasswordModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closePasswordModal();
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="change-password-title"
                        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="change-password-title"
                                    className="text-xl font-bold text-slate-900"
                                >
                                    Change Password
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Choose a new password for your account.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closePasswordModal}
                                disabled={passwordSaving}
                                aria-label="Close change password"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                            >
                                ✕
                            </button>
                        </div>

                        {passwordError && (
                            <div
                                role="alert"
                                className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                            >
                                {passwordError}
                            </div>
                        )}

                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Current Password
                                </label>
                                <input
                                    id="current-password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={currentPassword}
                                    onChange={(event) =>
                                        setCurrentPassword(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    New Password
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                    minLength={6}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Must be at least 6 characters.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    minLength={6}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closePasswordModal}
                                    disabled={passwordSaving}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={passwordSaving}
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {passwordSaving
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* Edit profile modal */}
            {isEditOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeEditModal();
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-profile-title"
                        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="edit-profile-title"
                                    className="text-xl font-bold text-slate-900"
                                >
                                    Edit Profile
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Update your account information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={saving}
                                aria-label="Close edit profile"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                            >
                                ✕
                            </button>
                        </div>

                        {formError && (
                            <div
                                role="alert"
                                className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                            >
                                {formError}
                            </div>
                        )}

                        <form
                            onSubmit={handleProfileUpdate}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="profile-name"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="profile-name"
                                    type="text"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    maxLength={100}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="profile-email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="profile-email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    maxLength={254}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Profile;