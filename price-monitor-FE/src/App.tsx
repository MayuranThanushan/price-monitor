import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import TrackersIndex from './pages/dashboard/TrackersIndex'
import CreateTracker from './pages/dashboard/CreateTracker'
import TrackerDetails from './pages/dashboard/TrackerDetails'
import EditTracker from './pages/dashboard/EditTracker'
import Offers from './pages/offers/Offers'
import Alerts from './pages/alerts/Alerts'
import Config from './pages/config/Config'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'
import ApiDocs from './pages/docs/ApiDocs'
import ProtectedRoute from './components/routing/ProtectedRoute'
import UserManagement from './pages/admin/UserManagement'
import AdminRoute from './components/routing/AdminRoute'
import { useAuthStore } from './context/AuthStore'

export default function App() {
  const { token } = useAuthStore()
  return (
    <div className='max-w-full'>
      <main>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected */}
          <Route element={<ProtectedRoute token={token} />}> 
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Product Tracking Purpose */}
            <Route path="/trackers" element={<TrackersIndex />} />
            <Route path="/trackers/new" element={<CreateTracker />} />
            <Route path="/trackers/:id" element={<TrackerDetails />} />
            <Route path="/trackers/:id/edit" element={<EditTracker />} />
            {/* Card / Bank Offers Purpose */}
            <Route path="/offers" element={<Offers />} />
            <Route path="/alerts" element={<Alerts />} />
            {/* Shared / Settings */}
            <Route path="/config" element={<Config />} />
            <Route path="/api" element={<ApiDocs />} />
            {/* Admin Only */}
            <Route element={<AdminRoute />}> 
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
          </Route>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
