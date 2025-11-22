import React, { useEffect, useState } from 'react'
import { me as getMe, updateUser } from '../../api/authAPI'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageContainer from '../../components/ui/PageContainer'
import SectionClean from '../../components/ui/SectionClean'
import Button from '../../components/ui/Button'
import { Plus, Trash, Save } from 'lucide-react'

export default function Account(){
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [err, setErr] = useState('')

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await getMe()
        setUser(res.data.user)
      }catch(e:any){ setErr('Failed to load user') }
      setLoading(false)
    }
    load()
  },[])

  const save = async ()=>{
    setErr('')
    try{
      const payload = { name: user.name, email: user.email, scrapeIntervalMinutes: user.scrapeIntervalMinutes, timeZone: user.timeZone, cards: user.cards }
      const res = await updateUser(payload)
      setUser(res.data.user)
    }catch(e:any){ setErr('Failed to save changes') }
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean title='Account Settings' />
        {loading && <div className='text-sm text-gray-600'>Loading...</div>}
        {err && !loading && <div className='text-sm text-red-600'>{err}</div>}
        {!loading && user && (
          <section className='space-y-6 rounded-lg border border-gray-200 bg-white p-6 mt-4'>
            <div className='grid sm:grid-cols-2 gap-6'>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Name</label>
                <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen' value={user.name||''} onChange={e=>setUser({...user, name: e.target.value})} />
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Email</label>
                <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen' value={user.email||''} onChange={e=>setUser({...user, email: e.target.value})} />
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Password (optional)</label>
                <input type='password' className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen' onChange={e=>setUser({...user, password: e.target.value})} />
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Scrape Interval (minutes)</label>
                <input type='number' className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen' value={user.scrapeIntervalMinutes||60} onChange={e=>setUser({...user, scrapeIntervalMinutes: Number(e.target.value)})} />
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Time Zone</label>
                <input className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen' value={user.timeZone||''} onChange={e=>setUser({...user, timeZone: e.target.value})} />
              </div>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-2'>Cards</label>
              <div className='space-y-3'>
                {(user.cards||[]).map((c:any, i:number)=>(
                  <div key={i} className='flex flex-wrap gap-2'>
                    <input className='flex-1 min-w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen' value={c.bank} placeholder='Bank' onChange={e=>{ const cards=[...user.cards]; cards[i].bank=e.target.value; setUser({...user,cards}) }} />
                    <input className='flex-1 min-w-[140px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen' value={c.card} placeholder='Card' onChange={e=>{ const cards=[...user.cards]; cards[i].card=e.target.value; setUser({...user,cards}) }} />
                    <Button type='button' variant='subtle' size='sm' onClick={()=>{ setUser({...user, cards: user.cards.filter((_:any, idx:number)=>idx!==i)}) }} className='text-red-600 hover:text-red-700 px-2 py-1'>
                      <Trash className='h-3 w-3' />
                    </Button>
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' onClick={()=> setUser({...user, cards: [...(user.cards||[]), { bank: '', card: '' }]})} className='gap-1'>
                  <Plus className='h-3 w-3' /> Add card
                </Button>
              </div>
            </div>
            <div className='flex justify-end'>
              <Button variant='primary' size='md' onClick={save} leftIcon={<Save className='h-4 w-4' />}>Save Changes</Button>
            </div>
          </section>
        )}
      </PageContainer>
    </DashboardLayout>
  )
}
