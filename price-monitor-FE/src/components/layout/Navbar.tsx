import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../context/AuthStore'
import Button from '../ui/Button'

export default function Navbar() {
  const { token, user, clearAuth } = useAuthStore()
  const nav = useNavigate()
  const logout = () => { clearAuth(); nav('/login') }
  return (
    <header className='bg-white shadow'>
      <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
        <Link to='/' className='font-bold text-lg'>Price Monitor</Link>
        <nav className='flex items-center gap-4'>
          <Link to='/' className='text-sm'>Dashboard</Link>
          <Link to='/trackers' className='text-sm'>Trackers</Link>
          {token ? (
            <>
              <span className='text-sm'>Hi, {user?.name || user?.email}</span>
                  <Button variant='danger' size='sm' onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-sm'>Login</Link>
              <Link to='/register' className='text-sm'>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
