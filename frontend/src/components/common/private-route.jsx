import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center">
        <span className="loading loading-spinner loading-lg w-52 mx-auto mt-12 text-primary"></span>
      </div>
    ); // O tu componente de loading
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
