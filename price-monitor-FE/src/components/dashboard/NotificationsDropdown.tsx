import React, { useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAlerts, markAllAlertsRead, markAlertRead } from '../../api/alertsAPI';

interface AlertItem {
  _id: string;
  type: 'drop' | 'below_threshold';
  productTitle: string;
  productUrl?: string;
  oldPrice?: number;
  newPrice: number;
  createdAt: string;
  read: boolean;
}

const typeColor: Record<string,string> = { drop: 'text-brandGreen', below_threshold: 'text-orange-600' };

const NotificationsDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data } = useQuery(['alerts'], () => listAlerts(true).then(r=>r.data), { enabled: open });
  const alerts: AlertItem[] = data?.data || [];

  const allReadMut = useMutation(markAllAlertsRead, { onSuccess: () => qc.invalidateQueries(['alerts']) });
  const readMut = useMutation(markAlertRead, { onSuccess: () => qc.invalidateQueries(['alerts']) });

  const timeAgo = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs/60000); if (mins < 60) return `${mins}m`; const hrs = Math.floor(mins/60); if (hrs < 24) return `${hrs}h`; const days = Math.floor(hrs/24); return `${days}d`; }

  return (
    <div className='relative'>
      <Button
        aria-label='Notifications'
        variant='icon'
        onClick={() => setOpen(o=>!o)}
        className='relative h-11 w-11'
      >
        <Bell size={18} />
        {alerts.length > 0 && (
          <span className='absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center'>
            {alerts.length}
          </span>
        )}
      </Button>
      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-20'>
          <div className='px-4 py-3 border-b border-gray-100 flex items-center justify-between'>
            <span className='font-semibold text-sm'>Alerts</span>
            <Button
              variant='primary'
              size='sm'
              disabled={allReadMut.isLoading || alerts.length === 0}
              onClick={() => allReadMut.mutate()}
              className='text-brandGreen hover:bg-brandGreen/10'
            >
              {allReadMut.isLoading ? <Loader2 className='h-3 w-3 animate-spin' /> : 'Mark all read'}
            </Button>
          </div>
          <ul className='max-h-64 overflow-y-auto divide-y divide-gray-100'>
            {alerts.map(n => (
              <li key={n._id} className='px-4 py-3 text-sm flex gap-2'>
                <span className={`font-semibold ${typeColor[n.type]}`}>•</span>
                <div className='flex flex-col flex-1'>
                  <span className='font-medium'>{n.productTitle}</span>
                  <span className='text-xs text-gray-600'>
                    {n.type === 'drop' && <>Price drop {n.oldPrice != null && <>from ${n.oldPrice.toFixed(2)} </>}to ${n.newPrice.toFixed(2)}</>} 
                    {n.type === 'below_threshold' && <>Now ${n.newPrice.toFixed(2)} below threshold</>}
                  </span>
                  <span className='text-xs text-gray-400 mt-1'>{timeAgo(n.createdAt)} ago</span>
                  {n.productUrl && <a href={n.productUrl} target='_blank' rel='noreferrer' className='text-xs text-brandGreen mt-1 hover:underline'>View product</a>}
                </div>
                <Button
                  onClick={() => readMut.mutate(n._id)}
                  variant='subtle'
                  size='sm'
                  className='self-start h-5 w-5 p-0 text-gray-400 hover:text-brandBlack'
                  aria-label='Mark read'
                >
                  <Check className='h-3 w-3' />
                </Button>
              </li>
            ))}
            {alerts.length === 0 && <li className='px-4 py-6 text-center text-xs text-gray-500'>No unread alerts.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
