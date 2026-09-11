import { useAuth } from "../context/useAuth.js";

function Header({ onMenuClick }) {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-6">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-md p-2 text-xl hover:bg-slate-100 md:hidden"
                    aria-label="Open navigation menu"
                >
                    ☰
                </button>

                <h1 className="text-xl font-semibold text-slate-800">
                    Job Tracker
                </h1>
            </div>

            <div className="text-sm text-slate-600">
                {user && <span>Welcome, {user.name}</span>}
            </div>
        </header>
    );
}

export default Header;