import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddApplication from "./pages/AddApplication";
import Applications from "./pages/Applications";
import ApplicationDetails from "./pages/ApplicationDetails";
import EditApplication from "./pages/EditApplication";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
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
                    path="/applications"
                    element={
                        <DashboardLayout>
                            <Applications />
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

                <Route
                    path="/applications/:id"
                    element={
                        <DashboardLayout>
                            <ApplicationDetails />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/applications/:id/edit"
                    element={<EditApplication />}
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