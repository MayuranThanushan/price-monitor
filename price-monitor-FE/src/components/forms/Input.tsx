import React from 'react'
type Props = { value:any, onChange:(v:any)=>void, placeholder?:string, type?:string }
export default function Input({ value, onChange, placeholder, type='text' }:Props){
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className='w-full border px-3 py-2 rounded' />
}
