import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { Plus, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '../../api/categoryAPI'
import KeywordInput from '../../components/forms/KeywordInput'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageContainer from '../../components/ui/PageContainer'
import SectionClean from '../../components/ui/SectionClean'

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
    <DashboardLayout>
      <PageContainer>
        <SectionClean title='New Tracker' className='mt-10'>
          <form onSubmit={submit} className='space-y-4 rounded-lg border border-gray-200 bg-white p-6 max-w-xl'>
            <input className='w-full border border-gray-300 px-3 py-2 rounded text-sm' placeholder='Tracker name' value={name} onChange={e=>setName(e.target.value)} />
            <input className='w-full border border-gray-300 px-3 py-2 rounded text-sm' placeholder='Base URL (e.g. https://www.daraz.lk)' value={baseUrl} onChange={e=>setBaseUrl(e.target.value)} />
            <input className='w-full border border-gray-300 px-3 py-2 rounded text-sm' placeholder='Category URL' value={categoryUrl} onChange={e=>setCategoryUrl(e.target.value)} />
            <div>
              <KeywordInput value={keywords} onChange={setKeywords} />
            </div>
            <input className='w-full border border-gray-300 px-3 py-2 rounded text-sm' placeholder='Max price' value={maxPrice} onChange={e=>setMaxPrice(e.target.value?Number(e.target.value):'')} />
            <label className='flex items-center gap-2 text-xs text-gray-600'>
              <input type='checkbox' checked={active} onChange={e=>setActive(e.target.checked)} /> Active
            </label>
            <div className='flex gap-3'>
              <Button type='submit' variant='primary' size='sm' leftIcon={<Plus className='h-3 w-3' />}>Create</Button>
              <Button type='button' variant='subtle' size='sm' onClick={()=>nav('/trackers')} leftIcon={<X className='h-3 w-3' />}>Cancel</Button>
            </div>
          </form>
        </SectionClean>
      </PageContainer>
    </DashboardLayout>
  )
}
