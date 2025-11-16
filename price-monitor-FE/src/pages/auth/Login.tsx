import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../../api/authAPI'
import { useAuthStore } from '../../context/AuthStore'

export default function Login(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState(''), [err,setErr]=useState('')
  const { setAuth } = useAuthStore()
  const nav = useNavigate()

  const submit = async (e:any) => {
    e.preventDefault()
    try {
      const res = await apiLogin({ email, password })
      const { token, user } = res.data
      setAuth(token, user)
      nav('/')
    } catch (err:any) {
      setErr(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className='max-w-md mx-auto mt-12 bg-white p-6 rounded shadow'>
      <h2 className='text-lg font-semibold mb-4'>Login</h2>
      <form onSubmit={submit} className='space-y-3'>
        <input className='w-full border px-3 py-2 rounded' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input className='w-full border px-3 py-2 rounded' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className='text-red-600'>{err}</div>}
        <button className='bg-blue-600 text-white px-4 py-2 rounded'>Login</button>
      </form>
    </div>
  )
}
