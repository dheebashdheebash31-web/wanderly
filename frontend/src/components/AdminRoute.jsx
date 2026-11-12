import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only staff users may open the admin panel. This is a convenience guard —
// the real protection is IsAdminUser on the /api/admin/ endpoints.
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_staff) return <Navigate to="/" replace />;
  return children;
}
