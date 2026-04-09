import React from "react";
import { Navigate, Outlet } from "react-router-dom"; // Use Outlet for nesting
import { useAuth } from "./authcontext";

// 1. Rename to reflect its purpose (e.g., AuthGuard or ProtectedRoute)
export default function AuthGuard() {
  const { session } = useAuth();

  // Handle the "Checking Auth" state
  if (session === undefined) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-blue-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current" />
      </div>
    );
  }

  // If no session, boot them to login
  if (!session) {
    return <Navigate to="/login" replace />; 
  }

  // If session exists, render the child routes
  return <Outlet />;
}