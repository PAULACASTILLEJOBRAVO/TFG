import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { roleDashboardMap } from "@/utils/auth";

// Component that protects routes that require authentication
const RequireAuth = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // If the user is not authenticated, redirect to the login page
        return <Navigate to="/" replace />;
    }

    // If the user is authenticated, check if they have the required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect automatically to the corresponding dashboard according to role
        return <Navigate to={roleDashboardMap[user.role] || "/"} replace />;
    }

    // If the user is authenticated and has the required role, render the protected component
    return children;
};

export default RequireAuth;