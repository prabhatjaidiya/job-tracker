import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth();
    const navItems = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l9-9 9 9"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"
                    />
                </svg>
            ),
        },
        {
            to: "/applications",
            label: "Applications",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h8l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 3v5h5M9 13h6M9 17h6M9 9h2"
                    />
                </svg>
            ),
        },
        {
            to: "/applications/add",
            label: "Add Application",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                    />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 h-screen left-0 z-40 flex w-64 flex-col overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 text-white shadow-2xl transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Decorative glow */}
                <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

                {/* Brand */}
                <div className="relative flex items-center gap-3 px-2 py-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 7h16M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h6M9 16h4"
                            />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold tracking-tight">
                            Job Tracker
                        </h2>

                        <p className="text-[11px] font-medium text-slate-500">
                            Career dashboard
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="relative mt-8 flex-1 space-y-2">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Workspace
                    </p>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/applications"}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-900/30"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active indicator */}
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                                    )}

                                    <span
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${isActive
                                                ? "bg-white/15 text-white"
                                                : "bg-slate-800/70 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                                            }`}
                                    >
                                        {item.icon}
                                    </span>

                                    <span>{item.label}</span>

                                    {isActive && (
                                        <svg
                                            className="ml-auto h-4 w-4 text-white/70"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom section */}
                <div className="relative space-y-3">
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                    {/* User card */}
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white shadow-md">
                            U
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                                Test User
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                Job seeker
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={logout}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/70 transition group-hover:bg-rose-500/10">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 17l5-5-5-5M15 12H3"
                                />
                            </svg>
                        </span>

                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;