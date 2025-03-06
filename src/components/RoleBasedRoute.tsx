
import { Navigate } from "react-router-dom";
import { UserRole } from "@/pages/UserSelection";

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles, children }) => {
  // Get the user role from localStorage
  const userRole = localStorage.getItem("userRole") as UserRole | null;
  
  // If there's no role or the role is not allowed, redirect to user selection
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  // If the role is allowed, render the children
  return <>{children}</>;
};

export default RoleBasedRoute;
