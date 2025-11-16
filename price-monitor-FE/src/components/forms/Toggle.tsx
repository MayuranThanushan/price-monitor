import React from 'react'
type Props = { checked:boolean, onChange:(v:boolean)=>void }
export default function Toggle({ checked, onChange }:Props){
  return (
    <label className='flex items-center gap-2 cursor-pointer'>
      <input type='checkbox' checked={checked} onChange={e=>onChange(e.target.checked)} className='hidden' />
      <span className={`w-10 h-5 rounded-full transition ${checked? 'bg-green-500':'bg-gray-300'}`}>
        <span className={`block w-4 h-4 bg-white rounded-full transform transition ${checked? 'translate-x-5':'translate-x-1'}`}></span>
      </span>
    </label>
  )
}
