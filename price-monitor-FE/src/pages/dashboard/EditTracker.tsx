import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { updateTracker } from '../../api/trackerAPI';
import Button from '../../components/ui/Button';
import { Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageContainer from '../../components/ui/PageContainer';
import SectionClean from '../../components/ui/SectionClean';
import { listTrackers } from '../../api/trackerAPI';

interface TrackerItem {
  _id: string;
  name: string;
  baseUrl: string;
  categories?: string[];
  keywords?: string[];
  maxPrice?: number;
  active?: boolean;
}

export default function EditTracker(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [tracker, setTracker] = useState<TrackerItem | null>(null);
  const [form, setForm] = useState<{ name:string; baseUrl:string; categories:string; keywords:string; maxPrice:string; active:boolean }>({ name:'', baseUrl:'', categories:'', keywords:'', maxPrice:'', active:true });

  useEffect(()=>{
    async function load(){
      try {
        const res = await listTrackers();
        const data = (res as any).data?.data || [];
        const found = data.find((t:TrackerItem)=>t._id === id);
        if(!found){ setError('Tracker not found'); }
        else {
          setTracker(found);
          setForm({
            name: found.name || '',
            baseUrl: found.baseUrl || '',
            categories: (found.categories || []).join(', '),
            keywords: (found.keywords || []).join(', '),
            maxPrice: found.maxPrice != null ? String(found.maxPrice) : '',
            active: found.active !== false
          });
        }
      } catch(e:any){
        setError('Failed to load tracker');
      } finally { setLoading(false); }
    }
    load();
  }, [id]);

  const mutation = useMutation((payload: Partial<TrackerItem>) => updateTracker(id!, payload).then(r=>r.data));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name: form.name,
      baseUrl: form.baseUrl,
      categories: form.categories.split(',').map(s=>s.trim()).filter(Boolean),
      keywords: form.keywords.split(',').map(s=>s.trim()).filter(Boolean),
      maxPrice: form.maxPrice ? Number(form.maxPrice) : undefined,
      active: form.active
    }, {
      onSuccess: () => navigate(`/trackers/${id}`)
    });
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean title='Edit Tracker' className='mt-10'>
        {loading && <div className='text-sm text-gray-500'>Loading tracker...</div>}
        {error && <div className='text-sm text-red-600'>{error}</div>}
        {!loading && !error && tracker && (
          <form onSubmit={submit} className='space-y-4 bg-white border border-gray-200 rounded-lg p-6 max-w-2xl'>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>Name</label>
              <input name='name' value={form.name} onChange={onChange} className='w-full rounded border-gray-300 text-sm'/>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>Base URL</label>
              <input name='baseUrl' value={form.baseUrl} onChange={onChange} className='w-full rounded border-gray-300 text-sm'/>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>Categories (comma separated)</label>
              <input name='categories' value={form.categories} onChange={onChange} className='w-full rounded border-gray-300 text-sm'/>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>Keywords (comma separated)</label>
              <input name='keywords' value={form.keywords} onChange={onChange} className='w-full rounded border-gray-300 text-sm'/>
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>Max Price</label>
              <input name='maxPrice' value={form.maxPrice} onChange={onChange} className='w-full rounded border-gray-300 text-sm'/>
            </div>
            <div className='flex items-center gap-2'>
              <input type='checkbox' name='active' checked={form.active} onChange={onChange} />
              <span className='text-xs text-gray-600'>Active</span>
            </div>
            <Button type='submit' disabled={mutation.isLoading} variant='primary' size='sm' leftIcon={<Save className='h-3 w-3' />}> 
              {mutation.isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        )}
        </SectionClean>
      </PageContainer>
    </DashboardLayout>
  );
}
