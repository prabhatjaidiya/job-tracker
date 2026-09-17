
import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage(data.message);
        } catch (err) {
            setError(
                err.message || "Unable to process your request"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                    Forgot Password
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    Enter your email address and we'll send you a
                    password reset link if an account exists.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Sending..."
                            : "Send reset link"}
                    </button>
                </form>

                {message && (
                    <p
                        role="status"
                        className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                    >
                        {message}
                    </p>
                )}

                {error && (
                    <p
                        role="alert"
                        className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <p className="mt-6 text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;