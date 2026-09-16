import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openSidebar = () => {
        setSidebarOpen(true);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 lg:flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar
                    isOpen={true}
                    onClose={closeSidebar}
                />
            </div>

            {/* Mobile / Tablet Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeSidebar}
                    />

                    <div className="relative h-full w-72">
                        <Sidebar
                            isOpen={sidebarOpen}
                            onClose={closeSidebar}
                        />
                    </div>
                </div>
            )}

            <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
                <Header onMenuClick={openSidebar} />

                <main className="min-h-0 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;