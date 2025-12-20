import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SearchPage from './pages/SearchPage';
import UsersPage from './pages/UsersPage';
import CompaniesPage from './pages/CompaniesPage';
import RoutesPage from './pages/RoutesPage';
import UserForm from './pages/UserForm';
import CompanyForm from './pages/CompanyForm';
import RouteForm from './pages/RouteForm';
import RoleBasedGuard from './components/RoleBasedGuard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TwoFactorPage from './pages/TwoFactorPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import ErrorBoundary from './components/ErrorBoundary';
import FeedbackPage from './pages/FeedbackPage';
import FeedbackForm from './pages/FeedbackForm';
import LocationsPage from './pages/LocationsPage';
import LocationForm from './pages/LocationForm';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/2fa" element={<TwoFactorPage />} />

          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Layout />
              </ErrorBoundary>
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="search" element={<SearchPage />} />
            {/* Admin Only Routes */}
            <Route path="users" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <UsersPage />
              </RoleBasedGuard>
            } />
            <Route path="users/new" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <UserForm />
              </RoleBasedGuard>
            } />
            <Route path="users/edit/:id" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <UserForm />
              </RoleBasedGuard>
            } />

            <Route path="companies" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <CompaniesPage />
              </RoleBasedGuard>
            } />
            <Route path="companies/new" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <CompanyForm />
              </RoleBasedGuard>
            } />
            <Route path="companies/edit/:id" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <CompanyForm />
              </RoleBasedGuard>
            } />

            {/* Shared Admin Routes */}
            <Route path="routes" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN']}>
                <RoutesPage />
              </RoleBasedGuard>
            } />
            <Route path="routes/new" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN']}>
                <RouteForm />
              </RoleBasedGuard>
            } />
            <Route path="routes/edit/:id" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN']}>
                <RouteForm />
              </RoleBasedGuard>
            } />

            <Route path="feedbacks" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN', 'COMPANY_ADMIN', 'USER']}>
                <FeedbackPage />
              </RoleBasedGuard>
            } />
            <Route path="feedbacks/new" element={
              <RoleBasedGuard allowedRoles={['USER']}>
                <FeedbackForm />
              </RoleBasedGuard>
            } />
            <Route path="locations" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <LocationsPage />
              </RoleBasedGuard>
            } />
            <Route path="locations/new" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <LocationForm />
              </RoleBasedGuard>
            } />
            <Route path="locations/edit/:id" element={
              <RoleBasedGuard allowedRoles={['SUPER_ADMIN']}>
                <LocationForm />
              </RoleBasedGuard>
            } />
            {/* Add other protected routes here */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
