import React, { useState } from 'react'
import { register as apiRegister } from '../../api/authAPI'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../context/AuthStore'
import TextField from '../../components/forms/TextField'
import Button from '../../components/ui/Button'
import { UserPlus } from 'lucide-react'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const nav = useNavigate()

  const submit = async (e:any) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await apiRegister({ name, email, password })
      const { token, user } = res.data
      setAuth(token, user)
      nav('/')
    } catch (err:any) {
      setErr(err.response?.data?.error || 'Registration failed')
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
            src='../src/assets/login-bg.png'
            alt='Price Monitor'
            className='absolute inset-0 m-auto max-w-full max-h-full'
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
            <h1 className='text-4xl font-extrabold tracking-tight text-brandBlack'>Create your account</h1>
            <p className='mt-4 text-base text-gray-600'>Join Price Monitor to track product prices, manage alerts and configure scraping.</p>
          </header>
          <form onSubmit={submit} className='space-y-6'>
            <TextField
              id='name'
              name='name'
              label='Name'
              required
              value={name}
              onChange={e=>setName(e.target.value)}
            />
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
              autoComplete='new-password'
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
                    leftIcon={<UserPlus className='h-4 w-4' />}
                    className='w-full justify-center'
                  >
                    {loading ? 'Creating account…' : 'Register'}
                  </Button>
            </div>
          </form>
          <p className='mt-8 text-sm text-gray-600'>Already have an account? <Link to='/login' className='font-medium text-brandGreen hover:underline'>Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
