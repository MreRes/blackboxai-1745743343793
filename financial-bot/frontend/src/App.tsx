import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense, lazy } from 'react';

// Context
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Common Components
import { LoadingSpinner } from './components/common';

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ActivateAccount = lazy(() => import('./pages/auth/ActivateAccount'));

// Main Pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Transactions = lazy(() => import('./pages/transactions/Transactions'));
const Budget = lazy(() => import('./pages/budget/Budget'));
const Reports = lazy(() => import('./pages/reports/Reports'));

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/activate" element={<ActivateAccount />} />
              </Route>

              {/* Protected Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* Redirect root to dashboard or login based on auth status */}
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-900">404</h1>
                      <p className="mt-4 text-xl text-gray-600">Page not found</p>
                      <button
                        onClick={() => window.history.back()}
                        className="mt-6 btn-primary"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
