import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/dashboard/Dashboard'
import CreateTracker from './pages/dashboard/CreateTracker'
import TrackerDetails from './pages/dashboard/TrackerDetails'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { useAuthStore } from './context/AuthStore'

export default function App() {
  const { token } = useAuthStore()
  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='p-6'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={ token ? <Dashboard /> : <Navigate to="/login" /> } />
          <Route path="/trackers" element={ token ? <Dashboard /> : <Navigate to="/login" /> } />
          <Route path="/trackers/new" element={ token ? <CreateTracker /> : <Navigate to="/login" /> } />
          <Route path="/trackers/:id" element={ token ? <TrackerDetails /> : <Navigate to="/login" /> } />
        </Routes>
      </main>
    </div>
  )
}
