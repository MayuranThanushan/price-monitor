import React, { useState } from 'react';
import { useAuthStore } from '../../context/AuthStore';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listTrackers, createTracker } from '../../api/trackerAPI';
import { listOfferSources, createOfferSource, deleteOfferSource, updateOfferSource } from '../../api/offersAPI';
import TextField from '../../components/forms/TextField';
import PageContainer from '../../components/ui/PageContainer';
import SectionClean from '../../components/ui/SectionClean';
import Button from '../../components/ui/Button';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';

export default function Config(){
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const { data: trackersData } = useQuery(['trackers'], () => listTrackers().then(r=>r.data));
  const { data: sourcesData } = useQuery(['offer-sources'], () => listOfferSources().then(r=>r.data));
  const trackers = trackersData?.data || [];
  const sources = sourcesData?.data || [];

  // Mode & form toggle
  const [mode, setMode] = useState<'trackers'|'offers'>('trackers');
  const [showForm, setShowForm] = useState(false);

  // Tracker form state
  const [tName, setTName] = useState('');
  const [tBaseUrl, setTBaseUrl] = useState('');
  const [tCategories, setTCategories] = useState('');
  const [tKeywords, setTKeywords] = useState('');
  const [tMaxPrice, setTMaxPrice] = useState('');
  const trackerMut = useMutation(createTracker, { onSuccess: () => { qc.invalidateQueries(['trackers']); resetTrackerForm(); } });
  const resetTrackerForm = () => { setTName(''); setTBaseUrl(''); setTCategories(''); setTKeywords(''); setTMaxPrice(''); setShowForm(false); };

  // Offer source form state
  const [bank, setBank] = useState('');
  const [cardType, setCardType] = useState<'credit'|'debit'|'both'>('both');
  const [offerUrl, setOfferUrl] = useState('');
  const [offerUrlCredit, setOfferUrlCredit] = useState('');
  const [offerUrlDebit, setOfferUrlDebit] = useState('');
  const offerSrcMut = useMutation(createOfferSource, { onSuccess: () => { qc.invalidateQueries(['offer-sources']); resetOfferForm(); } });
  const resetOfferForm = () => { setBank(''); setCardType('both'); setOfferUrl(''); setOfferUrlCredit(''); setOfferUrlDebit(''); setShowForm(false); };

  // Offer source editing
  const [editingId, setEditingId] = useState<string|null>(null);
  interface EditFormState { bank?: string; cardType?: 'credit'|'debit'|'both'; url?: string; urlCredit?: string; urlDebit?: string; active?: boolean; }
  const [editForm, setEditForm] = useState<EditFormState>({});
  const deleteSrcMut = useMutation(deleteOfferSource, { onSuccess: () => qc.invalidateQueries(['offer-sources']) });
  const updateSrcMut = useMutation((p: { id:string; payload:any }) => updateOfferSource(p.id, p.payload), { onSuccess: () => { qc.invalidateQueries(['offer-sources']); setEditingId(null); setEditForm({}); } });

  // Submit handlers
  const submitTracker = (e: React.FormEvent) => {
    e.preventDefault();
    trackerMut.mutate({
      name: tName,
      baseUrl: tBaseUrl,
      categories: tCategories.split(',').map(s=>s.trim()).filter(Boolean),
      keywords: tKeywords.split(',').map(s=>s.trim()).filter(Boolean),
      maxPrice: tMaxPrice ? Number(tMaxPrice) : undefined
    });
  };

  const submitOfferSource = (e: React.FormEvent) => {
    e.preventDefault();
    if(!bank) return;
    if(cardType === 'both') {
      if(!offerUrlCredit || !offerUrlDebit) return;
      offerSrcMut.mutate({ bank, cardType, urlCredit: offerUrlCredit, urlDebit: offerUrlDebit });
    } else {
      if(!offerUrl) return;
      offerSrcMut.mutate({ bank, cardType, url: offerUrl });
    }
  };

  const submitOfferSourceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingId) return;
    if(editForm.cardType === 'both') {
      updateSrcMut.mutate({ id: editingId, payload: { bank: editForm.bank, cardType: editForm.cardType, urlCredit: editForm.urlCredit, urlDebit: editForm.urlDebit, active: editForm.active } });
    } else {
      updateSrcMut.mutate({ id: editingId, payload: { bank: editForm.bank, cardType: editForm.cardType, url: editForm.url, active: editForm.active } });
    }
  };

  const addButtonLabel = mode === 'trackers' ? (trackerMut.isLoading ? 'Saving...' : 'Add Tracker') : (offerSrcMut.isLoading ? 'Saving...' : 'Add Source');
  const headerTitle = mode === 'trackers' ? (user?.role==='admin' ? 'All Trackers' : 'Trackers') : (user?.role==='admin' ? 'All Offer Sources' : 'Offer Sources');
  const formTitle = mode === 'trackers' ? 'New Tracker' : 'New Offer Source';

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean
          title='Configuration'
          description='Manage product tracking and bank/card offer sources.'
          actions={
            <div className='flex items-center gap-2'>
              <Button variant={mode==='trackers'?'primary':'outline'} size='sm' onClick={()=>{ setMode('trackers'); setShowForm(false); }}>Trackers</Button>
              <Button variant={mode==='offers'?'primary':'outline'} size='sm' onClick={()=>{ setMode('offers'); setShowForm(false); }}>Offers</Button>
              <Button variant='subtle' size='sm' leftIcon={<Plus size={14} />} onClick={()=> setShowForm(f=>!f)}>{showForm ? 'Close' : 'Add New'}</Button>
            </div>
          }
        />

        {showForm && (
          <SectionClean title={formTitle} className='mt-10'>
            {mode === 'trackers' && (
              <form onSubmit={submitTracker} className='space-y-4 rounded-lg border border-gray-200 bg-white p-6'>
                <TextField id='tName' label='Name' required value={tName} onChange={e=>setTName(e.target.value)} />
                <TextField id='tBaseUrl' label='Base URL' required value={tBaseUrl} onChange={e=>setTBaseUrl(e.target.value)} />
                <TextField id='tCategories' label='Categories (comma separated)' value={tCategories} onChange={e=>setTCategories(e.target.value)} />
                <TextField id='tKeywords' label='Keywords (comma separated)' value={tKeywords} onChange={e=>setTKeywords(e.target.value)} />
                <TextField id='tMaxPrice' label='Max Price' value={tMaxPrice} onChange={e=>setTMaxPrice(e.target.value)} />
                <div className='flex gap-3'>
                  <Button disabled={trackerMut.isLoading} variant='primary' size='sm' leftIcon={<Plus className='h-3 w-3' />}>{addButtonLabel}</Button>
                  <Button type='button' variant='subtle' size='sm' leftIcon={<X className='h-3 w-3' />} onClick={()=>setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            )}
            {mode === 'offers' && (
              <form onSubmit={submitOfferSource} className='space-y-4 rounded-lg border border-gray-200 bg-white p-6'>
                <TextField id='bank' label='Bank' required value={bank} onChange={e=>setBank(e.target.value)} />
                <div>
                  <label className='block text-sm font-medium text-brandBlack mb-1'>Card Type <span className='text-red-600'>*</span></label>
                  <select value={cardType} onChange={e=>setCardType(e.target.value as any)} className='block w-full rounded-md border border-brandGreen/40 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen focus:border-brandGreen'>
                    <option value='both'>Both</option>
                    <option value='credit'>Credit</option>
                    <option value='debit'>Debit</option>
                  </select>
                </div>
                {cardType !== 'both' && (
                  <TextField id='offerUrl' label='Offers Page URL' required value={offerUrl} onChange={e=>setOfferUrl(e.target.value)} />
                )}
                {cardType === 'both' && (
                  <div className='grid sm:grid-cols-2 gap-4'>
                    <TextField id='offerUrlCredit' label='Credit Offers URL' required value={offerUrlCredit} onChange={e=>setOfferUrlCredit(e.target.value)} />
                    <TextField id='offerUrlDebit' label='Debit Offers URL' required value={offerUrlDebit} onChange={e=>setOfferUrlDebit(e.target.value)} />
                  </div>
                )}
                <div className='flex gap-3'>
                  <Button disabled={offerSrcMut.isLoading} variant='primary' size='sm' leftIcon={<Plus className='h-3 w-3' />}>{addButtonLabel}</Button>
                  <Button type='button' variant='subtle' size='sm' leftIcon={<X className='h-3 w-3' />} onClick={()=>setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </SectionClean>
        )}

        {!showForm && (
        <SectionClean title={headerTitle} className='mt-10'>
          <ul className='space-y-3 mt-4'>
            {mode==='trackers' && trackers.map((t:any)=>(
              <li key={t._id} className='flex justify-between items-center rounded-lg border border-gray-200 bg-white p-5'>
                <div className='min-w-0'>
                  <div className='font-medium text-sm truncate max-w-xs'>{t.name}</div>
                  <div className='text-xs text-gray-500 truncate max-w-xs'>{t.baseUrl}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${t.active ? 'bg-brandGreen/10 text-brandGreen' : 'bg-gray-100 text-gray-600'}`}>{t.active ? 'Active' : 'Inactive'}</span>
              </li>
            ))}
            {mode==='trackers' && trackers.length === 0 && <li className='text-xs text-gray-500'>No trackers yet.</li>}

            {mode==='offers' && sources.map((s:any)=>{
              const isEditing = editingId === s._id;
              return (
                <li key={s._id} className='rounded-lg border border-gray-200 bg-white p-5 space-y-3'>
                  {!isEditing && (
                    <div className='flex justify-between items-start gap-4'>
                      <div className='flex-1 space-y-1 min-w-0'>
                        <span className='font-medium text-sm truncate'>{s.bank} <span className='text-xs text-gray-500'>({s.cardType})</span></span>
                        {s.cardType === 'both' ? (
                          <div className='text-xs text-gray-600 space-y-1'>
                            <div><span className='font-semibold'>Credit:</span> {s.urlCredit || s.url || '—'}</div>
                            <div><span className='font-semibold'>Debit:</span> {s.urlDebit || s.url || '—'}</div>
                          </div>
                        ) : (
                          <div className='text-xs text-gray-600 break-all'>{s.url}</div>
                        )}
                        <div className='text-xs'>Status: {s.active ? <span className='text-brandGreen font-medium'>active</span> : <span className='text-gray-500'>inactive</span>}</div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <Button variant='outline' size='sm' leftIcon={<Edit className='h-3 w-3' />} onClick={()=>{ setEditingId(s._id); setEditForm({ bank:s.bank, cardType:s.cardType, url:s.url, urlCredit:s.urlCredit, urlDebit:s.urlDebit, active:s.active }); }}>Edit</Button>
                        <Button variant='danger' size='sm' leftIcon={<Trash className='h-3 w-3' />} disabled={deleteSrcMut.isLoading} onClick={()=>deleteSrcMut.mutate(s._id)}>Delete</Button>
                      </div>
                    </div>
                  )}
                  {isEditing && (
                    <form onSubmit={submitOfferSourceUpdate} className='space-y-4'>
                      <div className='grid sm:grid-cols-2 gap-4'>
                        <TextField id={`edit-bank-${s._id}`} label='Bank' required value={editForm.bank || ''} onChange={e=>setEditForm((prev:EditFormState)=>({ ...prev, bank:e.target.value }))} />
                        <div>
                          <label className='block text-sm font-medium text-brandBlack mb-1'>Card Type <span className='text-red-600'>*</span></label>
                          <select value={editForm.cardType || 'both'} onChange={e=>setEditForm((prev:EditFormState)=>({ ...prev, cardType:e.target.value as EditFormState['cardType'] }))} className='block w-full rounded-md border border-brandGreen/40 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandGreen focus:border-brandGreen'>
                            <option value='credit'>Credit</option>
                            <option value='debit'>Debit</option>
                            <option value='both'>Both</option>
                          </select>
                        </div>
                      </div>
                      {editForm.cardType === 'both' ? (
                        <div className='grid sm:grid-cols-2 gap-4'>
                          <TextField id={`edit-url-credit-${s._id}`} label='Credit URL' required value={editForm.urlCredit || ''} onChange={e=>setEditForm((prev:EditFormState)=>({ ...prev, urlCredit:e.target.value }))} />
                          <TextField id={`edit-url-debit-${s._id}`} label='Debit URL' required value={editForm.urlDebit || ''} onChange={e=>setEditForm((prev:EditFormState)=>({ ...prev, urlDebit:e.target.value }))} />
                        </div>
                      ) : (
                        <TextField id={`edit-url-${s._id}`} label='Offers Page URL' required value={editForm.url || ''} onChange={e=>setEditForm((prev:EditFormState)=>({ ...prev, url:e.target.value }))} />
                      )}
                      <label className='flex items-center gap-2 text-xs text-gray-700'>
                        <input type='checkbox' checked={!!editForm.active} onChange={e=>setEditForm((prev:EditFormState)=>({ ...prev, active:e.target.checked }))} />Active
                      </label>
                      <div className='flex items-center gap-3'>
                        <Button type='submit' disabled={updateSrcMut.isLoading} variant='primary' size='sm' leftIcon={<Save className='h-3 w-3' />}>{updateSrcMut.isLoading ? 'Saving...' : 'Save'}</Button>
                        <Button type='button' variant='subtle' size='sm' leftIcon={<X className='h-3 w-3' />} onClick={()=>{ setEditingId(null); setEditForm({}); }}>Cancel</Button>
                      </div>
                    </form>
                  )}
                </li>
              );
            })}
            {mode==='offers' && sources.length === 0 && <li className='text-xs text-gray-500'>No sources yet.</li>}
          </ul>
        </SectionClean>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
