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
        <div className="min-h-screen bg-slate-100 md:flex">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            <div className="min-w-0 flex-1 h-screen flex flex-col overflow-hidden">
                <Header onMenuClick={openSidebar} />

                <main className="min-h-0 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;