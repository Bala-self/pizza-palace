import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children , adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen space-x-2">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-150"></div>
      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-300"></div>
    </div>
  );
}


    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
