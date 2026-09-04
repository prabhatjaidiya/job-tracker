import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddApplication from "./pages/AddApplication";

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/applications/add"
                    element={
                        <DashboardLayout>
                            <AddApplication />
                        </DashboardLayout>
                    }
                />
            </Route>

            {/* Default route */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}

export default App;