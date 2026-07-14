import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({
  children, requireEditor = false,
}: { children: ReactNode; requireEditor?: boolean }) {
  const { session, isEditor, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (requireEditor && !isEditor) return <Navigate to="/" replace />;
  return <>{children}</>;
}
