import React from 'react';
import { useAuthStore } from '../../context/AuthStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAlerts, markAlertRead, markAllAlertsRead } from '../../api/alertsAPI';
import StateBlock from '../../components/ui/StateBlock';
import { useBackendGuard } from '../../hooks/useBackendGuard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageContainer from '../../components/ui/PageContainer';
import SectionClean from '../../components/ui/SectionClean';
import Button from '../../components/ui/Button';
import { Check, Eye, Loader2 } from 'lucide-react';

interface AlertItem {
  _id: string;
  type: string;
  message: string;
  productId?: string;
  categoryId?: string;
  trackerId?: string;
  createdAt: string;
  read?: boolean;
}

export default function Alerts(){
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery(['alerts'], () => listAlerts().then(r=>r.data), { refetchOnWindowFocus:false });
  useBackendGuard({ isError, error });
  const alerts: AlertItem[] = data?.data || [];

  const markReadMutation = useMutation((id:string) => markAlertRead(id).then(r=>r.data), {
    onSuccess: () => qc.invalidateQueries(['alerts'])
  });
  const markAllMutation = useMutation(() => markAllAlertsRead().then(r=>r.data), {
    onSuccess: () => qc.invalidateQueries(['alerts'])
  });

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean title='Alerts' actions={<Button onClick={()=>markAllMutation.mutate()} disabled={markAllMutation.isLoading || alerts.length===0} variant='primary' size='sm' leftIcon={<Eye className='h-3 w-3' />}>{markAllMutation.isLoading ? <span className='flex items-center gap-1'><Loader2 className='h-3 w-3 animate-spin' /> Marking...</span> : 'Mark All Read'}</Button>} />
        {isLoading && <StateBlock variant='loading' />}
        {isError && <StateBlock variant='error' />}
        {!isLoading && !isError && alerts.length === 0 && <StateBlock variant='empty' message={user?.role==='admin' ? 'No alerts across users.' : 'No data to show.'} />}
        <SectionClean className='mt-10'>
          <ul className='space-y-3 mt-4'>
            {alerts.map(a => (
              <li key={a._id} className={`rounded-lg border p-5 flex items-start gap-4 bg-white ${a.read ? 'border-gray-200' : 'border-brandGreen/60'}`}>
                <div className='flex-1 space-y-2'>
                  <div className='flex items-center gap-2'>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${a.read ? 'bg-gray-100 text-gray-500' : 'bg-brandGreen text-white'}`}>{a.type}</span>
                    <span className='text-xs text-gray-400'>{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                  <p className='text-sm text-brandBlack'>{a.message}</p>
                </div>
                  {!a.read && (
                    <Button onClick={()=>markReadMutation.mutate(a._id)} disabled={markReadMutation.isLoading} variant='outline' size='sm' leftIcon={<Check className='h-3 w-3' />}>Mark Read</Button>
                  )}
              </li>
            ))}
          </ul>
        </SectionClean>
      </PageContainer>
    </DashboardLayout>
  );
}
