import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthStore';

export default function AdminRoute(){
  const { user } = useAuthStore();
  if (!user || user.role !== 'admin') return <Navigate to='/dashboard' replace />;
  return <Outlet />;
}