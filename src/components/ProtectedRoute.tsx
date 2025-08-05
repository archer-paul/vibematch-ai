import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserType } from '@/hooks/useAuth';
import { isDemoMode } from '@/data/demoData';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: UserType;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ children, requiredUserType, requireOnboarding = true }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const demoMode = isDemoMode();

  if (loading && !demoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // In demo mode, bypass all authentication checks
  if (demoMode) {
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredUserType && profile?.user_type !== requiredUserType) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated but hasn't completed onboarding and is a creator
  if (requireOnboarding && profile && !profile.onboarding_completed && profile.user_type === 'creator') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user is on onboarding page but has already completed it
  if (!requireOnboarding && profile?.onboarding_completed) {
    // Redirect both creators and sponsors to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}