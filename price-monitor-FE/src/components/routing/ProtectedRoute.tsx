import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  token: string | null;
}

export default function ProtectedRoute({ token }: ProtectedRouteProps){
  if(!token){
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
