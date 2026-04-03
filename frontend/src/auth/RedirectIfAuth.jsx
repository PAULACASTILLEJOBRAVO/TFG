import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { roleDashboardMap } from "@/utils/auth";

const RedirectIfAuth = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect automatically to the corresponding dashboard according to role
    return <Navigate to={roleDashboardMap[user.role] || "/"} replace />;
  }

  return children;
};

export default RedirectIfAuth;
