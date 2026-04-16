import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function OrganizerOrAdminRoute({ children }) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <p className="status">Loading access check...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!['organizer', 'admin'].includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
