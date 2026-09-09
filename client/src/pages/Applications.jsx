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

    const getStatusClass = (status) => {
        switch (status) {
            case "Applied":
                return "bg-blue-100 text-blue-700";

            case "Interview":
                return "bg-yellow-100 text-yellow-700";

            case "Assessment":
                return "bg-purple-100 text-purple-700";

            case "Offer":
                return "bg-green-100 text-green-700";

            case "Rejected":
                return "bg-red-100 text-red-700";

            case "Withdrawn":
                return "bg-slate-100 text-slate-700";

            default:
                return "bg-slate-100 text-slate-700";
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

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Applications
                    </h1>

                    <p className="mt-1 text-sm text-slate-600">
                        View and manage your job applications.
                    </p>
                </div>

                <Link
                    to="/applications/add"
                    className="whitespace-nowrap rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                    + Add Application
                </Link>
            </div>

            {error && (
                <p className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 font-semibold">
                                    Company
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Position
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Location
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Job Type
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Status
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Applied Date
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Deadline
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-10 text-center text-slate-500"
                                    >
                                        Loading applications...
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-10 text-center text-slate-500"
                                    >
                                        No applications yet.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((application) => (
                                    <tr
                                        key={application._id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="px-6 py-4">
                                            {application.company}
                                        </td>

                                        <td className="px-6 py-4">
                                            {application.position}
                                        </td>

                                        <td className="px-6 py-4">
                                            {application.location}
                                        </td>

                                        <td className="px-6 py-4">
                                            {application.jobType}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                    application.status
                                                )}`}
                                            >
                                                {application.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            {formatDate(
                                                application.appliedDate
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            {formatDate(
                                                application.deadline
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Applications;