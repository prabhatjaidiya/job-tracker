import { useAuth } from "../context/useAuth.js";

function Header({ onMenuClick }) {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-4 md:px-6 lg:hidden">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-md p-2 text-xl hover:bg-slate-100 lg:hidden"
                    aria-label="Open navigation menu"
                >
                    ☰
                </button>

                <h1 className="text-lg font-semibold text-slate-800 sm:text-xl">
                    Job Tracker
                </h1>
            </div>

            <div className="min-w-0 truncate text-right text-xs text-slate-600 sm:text-sm">
                {user && <span>Welcome, {user.name}</span>}
            </div>
        </header>
    );
}

export default Header;