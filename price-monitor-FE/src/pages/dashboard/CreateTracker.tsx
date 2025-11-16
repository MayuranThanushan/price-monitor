import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '../../api/categoryAPI'
import KeywordInput from '../../components/forms/KeywordInput'

export default function CreateTracker(){
  const [name,setName]=useState(''), [baseUrl,setBaseUrl]=useState(''), [categoryUrl,setCategoryUrl]=useState(''), [keywords,setKeywords]=useState<string[]>([]), [maxPrice,setMaxPrice]=useState<number|''>(''), [active,setActive]=useState(true)
  const qc = useQueryClient(); const nav = useNavigate()

  const mutation = useMutation((data:any)=> createCategory(data), {
    onSuccess: ()=> { qc.invalidateQueries(['categories']); nav('/trackers') }
  })

  const submit = (e:any) => {
    e.preventDefault()
    if(!name||!baseUrl||!categoryUrl||!maxPrice) return alert('fill required')
    mutation.mutate({ name, baseUrl, categoryUrl, keywords, maxPrice: Number(maxPrice), active })
  }

  return (
    <div className='max-w-xl mx-auto bg-white p-6 rounded shadow'>
      <h3 className='text-lg font-semibold mb-4'>New Tracker</h3>
      <form onSubmit={submit} className='space-y-3'>
        <input className='w-full border px-3 py-2 rounded' placeholder='Tracker name' value={name} onChange={e=>setName(e.target.value)} />
        <input className='w-full border px-3 py-2 rounded' placeholder='Base URL (e.g. https://www.daraz.lk)' value={baseUrl} onChange={e=>setBaseUrl(e.target.value)} />
        <input className='w-full border px-3 py-2 rounded' placeholder='Category URL' value={categoryUrl} onChange={e=>setCategoryUrl(e.target.value)} />
        <div>
          <KeywordInput value={keywords} onChange={setKeywords} />
        </div>
        <input className='w-full border px-3 py-2 rounded' placeholder='Max price' value={maxPrice} onChange={e=>setMaxPrice(e.target.value?Number(e.target.value):'')} />
        <div className='flex items-center gap-2'>
          <input type='checkbox' checked={active} onChange={e=>setActive(e.target.checked)} /> Active
        </div>
        <div className='flex gap-2'>
          <button className='bg-blue-600 text-white px-4 py-2 rounded'>Create</button>
          <button type='button' onClick={()=>nav('/trackers')} className='px-4 py-2 rounded border'>Cancel</button>
        </div>
      </form>
    </div>
  )
}
