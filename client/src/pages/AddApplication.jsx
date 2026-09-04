import { useState } from "react";

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
                setApiError(data.message || "Failed to create application.");
                return;
            }

            setSuccess("Application added successfully.");
            console.log(data);
        } catch (error) {
            setApiError("Unable to connect to the server.");
            console.error("Failed to create application:", error);
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
    };

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">
                Add Application
            </h1>

            {success && (
                <p className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
                    {success}
                </p>
            )}
            {apiError && (
                <p className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {apiError}
                </p>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Company */}
                <div>
                    <label
                        htmlFor="company"
                        className="mb-1 block text-sm font-medium"
                    >
                        Company *
                    </label>
                    <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                    {errors.company && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.company}
                        </p>
                    )}
                </div>

                {/* Position */}
                <div>
                    <label
                        htmlFor="position"
                        className="mb-1 block text-sm font-medium"
                    >
                        Position *
                    </label>
                    <input
                        id="position"
                        name="position"
                        type="text"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                    {errors.position && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.position}
                        </p>
                    )}
                </div>

                {/* Location */}
                <div>
                    <label
                        htmlFor="location"
                        className="mb-1 block text-sm font-medium"
                    >
                        Location *
                    </label>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                    {errors.location && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.location}
                        </p>
                    )}
                </div>

                {/* Job Type */}
                <div>
                    <label
                        htmlFor="jobType"
                        className="mb-1 block text-sm font-medium"
                    >
                        Job Type *
                    </label>
                    <select
                        id="jobType"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        <option value="" disabled>
                            Select job type
                        </option>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                    {errors.jobType && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.jobType}
                        </p>
                    )}
                </div>

                {/* Salary */}
                <div>
                    <label
                        htmlFor="salary"
                        className="mb-1 block text-sm font-medium"
                    >
                        Salary
                    </label>
                    <input
                        id="salary"
                        name="salary"
                        type="number"
                        min="0"
                        value={formData.salary}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                {/* Status */}
                <div>
                    <label
                        htmlFor="status"
                        className="mb-1 block text-sm font-medium"
                    >
                        Status *
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        <option value="" disabled>
                            Select status
                        </option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Assessment">Assessment</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Withdrawn">Withdrawn</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.status}
                        </p>
                    )}
                </div>

                {/* Application Date */}
                <div>
                    <label
                        htmlFor="appliedDate"
                        className="mb-1 block text-sm font-medium"
                    >
                        Application Date
                    </label>
                    <input
                        id="appliedDate"
                        name="appliedDate"
                        type="date"
                        value={formData.appliedDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                {/* Deadline */}
                <div>
                    <label
                        htmlFor="deadline"
                        className="mb-1 block text-sm font-medium"
                    >
                        Deadline
                    </label>
                    <input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                {/* Job URL */}
                <div>
                    <label
                        htmlFor="jobUrl"
                        className="mb-1 block text-sm font-medium"
                    >
                        Job URL
                    </label>
                    <input
                        id="jobUrl"
                        name="jobUrl"
                        type="url"
                        placeholder="https://example.com/job"
                        value={formData.jobUrl}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="mb-1 block text-sm font-medium"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label
                        htmlFor="notes"
                        className="mb-1 block text-sm font-medium"
                    >
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="4"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                {/* Contact */}
                <div>
                    <label
                        htmlFor="contact"
                        className="mb-1 block text-sm font-medium"
                    >
                        Contact
                    </label>
                    <input
                        id="contact"
                        name="contact"
                        type="text"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        className="rounded-lg border px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Application"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddApplication;