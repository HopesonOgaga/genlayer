import React from "react";
import { useAuth } from "./authcontext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  // Show a loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-blue-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current" />
      </div>
    );
  }

  // Redirect to login if no active session
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  return children;
}
