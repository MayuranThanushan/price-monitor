import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as apiLogin, forgotPassword } from '../../api/authAPI'
import { useAuthStore } from '../../context/AuthStore'
import TextField from '../../components/forms/TextField'
import Button from '../../components/ui/Button'
import { LogIn } from 'lucide-react'
import loginBg from '../../assets/login-bg.png'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMsg, setForgotMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const nav = useNavigate()

  const submit = async (e:any) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await apiLogin({ email, password })
      const { token, user } = res.data
      setAuth(token, user)
      nav('/')
    } catch (err:any) {
      setErr(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const submitForgot = async (e:any) => {
    e.preventDefault()
    setForgotMsg('')
    setErr('')
    setLoading(true)
    try {
      const res = await forgotPassword({ email: forgotEmail })
      setForgotMsg(res.data.message || 'If that email exists, a temporary password was sent.')
    } catch (err:any) {
      setErr(err.response?.data?.error || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 min-h-screen w-full'>
      {/* Left image panel */}
      <div className='hidden md:block min-h-full w-full bg-green-100 p-24'>
        <div className='h-full w-full relative'>
          <img
            src={loginBg}
            alt='Price Monitor illustration'
            className='absolute inset-0 m-auto max-w-full max-h-full'
            loading='eager'
          />
        </div>
      </div>

      {/* Right form panel */}
      <div className='flex items-center justify-center min-h-full bg-white px-6 md:px-12'>
        <div className='w-full max-w-lg'>
          <div className='px-5 py-6 text-center'>
            <div className='text-2xl font-extrabold tracking-tight'>Price<span className='text-brandGreen'>Monitor</span></div>
          </div>
          <header className='mb-10'>
              <h1 className='text-4xl font-extrabold tracking-tight text-brandBlack'>Welcome to Price Monitor</h1>
            <p className='mt-4 text-base text-gray-600'>Sign in to manage your trackers, view price history and configure scraping.</p>
          </header>
          {!forgotMode && (
          <form onSubmit={submit} className='space-y-6'>
            <TextField
              id='email'
              name='email'
              type='email'
              label='Email'
              required
              autoComplete='email'
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
            <TextField
              id='password'
              name='password'
              type='password'
              label='Password'
              required
              autoComplete='current-password'
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />
            {err && <div className='text-sm text-red-600'>{err}</div>}
            <div>
                      <Button
                        type='submit'
                        disabled={loading}
                        variant='primary'
                        size='md'
                        leftIcon={<LogIn className='h-4 w-4' />}
                        className='w-full justify-center'
                      >
                        {loading ? 'Signing in…' : 'Sign In'}
                      </Button>
            </div>
            <div className='text-sm'>
              <a role='button' onClick={()=>{ setForgotMode(true); setForgotEmail(email); }} className='text-red-600 hover:underline'>Forgot password?</a>
            </div>
          </form>
          )}
          {forgotMode && (
            <form onSubmit={submitForgot} className='space-y-6'>
              <TextField
                id='forgotEmail'
                name='forgotEmail'
                type='email'
                label='Email'
                required
                autoComplete='email'
                value={forgotEmail}
                onChange={e=>setForgotEmail(e.target.value)}
              />
              {forgotMsg && <div className='text-sm text-green-600'>{forgotMsg}</div>}
              {err && <div className='text-sm text-red-600'>{err}</div>}
              <div className='flex gap-2'>
                <Button
                  type='submit'
                  disabled={loading}
                  variant='primary'
                  size='md'
                  className='flex-1 justify-center'
                >
                  {loading ? 'Sending…' : 'Send Temporary Password'}
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  size='md'
                  className='flex-1 justify-center'
                  onClick={()=>{ setForgotMode(false); setForgotMsg(''); setErr(''); }}
                >Back to Login</Button>
              </div>
            </form>
          )}
          {!forgotMode && <p className='mt-8 text-sm text-gray-600'>Don't have an account? <Link to='/register' className='font-medium text-green-600 hover:underline'>Create one</Link></p>}
        </div>
      </div>
    </div>
  )
}
