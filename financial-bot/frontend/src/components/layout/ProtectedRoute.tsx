import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, token, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      // Save the attempted URL for redirecting after login
      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      });
    } else if (!isLoading && requireAdmin && user?.role !== 'admin') {
      // Redirect non-admin users attempting to access admin routes
      navigate('/dashboard', { replace: true });
    }
  }, [user, token, isLoading, navigate, location, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Only render children if user is authenticated and meets role requirements
  if (user && token && (!requireAdmin || user.role === 'admin')) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;

// Usage example:
/*
// In your router setup
<Routes>
  {/* Public routes *\/}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected user routes *\/}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  
  {/* Protected admin routes *\/}
  <Route
    path="/admin"
    element={
      <ProtectedRoute requireAdmin>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
*/
