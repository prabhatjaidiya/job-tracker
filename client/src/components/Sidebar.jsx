import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 w-50 lg:w-64 transform bg-slate-900 p-6 text-white transition-transform md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            <h2 className="mb-8 text-2xl font-bold">
                Job Tracker
            </h2>

            <nav className="space-y-2">
                <NavLink
                    to="/dashboard"
                    onClick={onClose}
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 transition ${isActive
                            ? "bg-slate-700 font-semibold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/applications"
                    end
                    onClick={onClose}
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 transition ${isActive
                            ? "bg-slate-700 font-semibold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`
                    }
                >
                    Applications
                </NavLink>
                <NavLink
                    to="/applications/add"
                    onClick={onClose}
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 transition ${isActive
                            ? "bg-slate-700 font-semibold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`
                    }
                >
                    Add Application
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;
