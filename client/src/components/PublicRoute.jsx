import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import Loading from "./Loading.jsx";

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;