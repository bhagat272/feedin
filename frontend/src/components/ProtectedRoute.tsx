import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  isPublic?: boolean; // if true → accessible without login
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isPublic = false }) => {
  const token = useSelector((state: any) => state.auth.token);

  if (isPublic) {
    // Public route → if logged in, redirect to dashboard
    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
  }

  // Protected route → if not logged in, redirect to login
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
