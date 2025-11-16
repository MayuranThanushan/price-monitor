import React, { useState } from 'react'
import { register as apiRegister } from '../../api/authAPI'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../context/AuthStore'

export default function Register(){
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [password,setPassword]=useState(''), [err,setErr]=useState('')
  const { setAuth } = useAuthStore()
  const nav = useNavigate()

  const submit = async (e:any) => {
    e.preventDefault()
    try {
      const res = await apiRegister({ name, email, password })
      const { token, user } = res.data
      setAuth(token, user)
      nav('/')
    } catch (err:any) {
      setErr(err.response?.data?.error || 'Register failed')
    }
  }

  return (
    <div className='max-w-md mx-auto mt-12 bg-white p-6 rounded shadow'>
      <h2 className='text-lg font-semibold mb-4'>Register</h2>
      <form onSubmit={submit} className='space-y-3'>
        <input className='w-full border px-3 py-2 rounded' placeholder='Name' value={name} onChange={e=>setName(e.target.value)} />
        <input className='w-full border px-3 py-2 rounded' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input className='w-full border px-3 py-2 rounded' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className='text-red-600'>{err}</div>}
        <button className='bg-green-600 text-white px-4 py-2 rounded'>Register</button>
      </form>
    </div>
  )
}
