import React from 'react';
import { Link } from 'react-router-dom';

export interface TrackerCardProps {
  id: string;
  name: string;
  url: string;
  currentPrice?: number; // lowest price
  targetPrice?: number; // max price threshold
  avgPrice?: number;
  productCount?: number;
  trend?: 'UP' | 'DOWN' | 'SAME';
  status?: 'OK' | 'WATCH' | 'ALERT';
}

const statusColors: Record<string,string> = {
  OK: 'bg-brandGreen/10 text-brandGreen',
  WATCH: 'bg-yellow-100 text-yellow-700',
  ALERT: 'bg-red-100 text-red-600'
};

const TrackerCard: React.FC<TrackerCardProps> = ({ id, name, url, currentPrice, targetPrice, avgPrice, productCount, trend='SAME', status='OK' }) => {
  return (
    <div className='bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col gap-3'>
      <div className='flex items-start justify-between gap-2'>
        <div>
          <h4 className='font-semibold text-brandBlack line-clamp-1'>{name}</h4>
          <div className='text-xs text-gray-500 truncate'>{url}</div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[status]}`}>{status}</span>
      </div>
      <div className='grid grid-cols-4 gap-3 text-xs'>
        <div className='flex flex-col'>
          <span className='text-gray-500'>Low</span>
          <span className='font-semibold'>{currentPrice != null ? `$${currentPrice.toFixed(2)}` : '—'}</span>
        </div>
        <div className='flex flex-col'>
          <span className='text-gray-500'>Avg</span>
          <span className='font-semibold'>{avgPrice != null ? `$${avgPrice.toFixed(2)}` : '—'}</span>
        </div>
        <div className='flex flex-col'>
          <span className='text-gray-500'>Target</span>
          <span className='font-semibold'>{targetPrice != null ? `$${targetPrice.toFixed(2)}` : '—'}</span>
        </div>
        <div className='flex flex-col'>
          <span className='text-gray-500'>Trend</span>
          <span className={`font-semibold ${trend==='DOWN'?'text-brandGreen':trend==='UP'?'text-red-600':'text-gray-600'}`}>{trend}</span>
        </div>
      </div>
      <div className='mt-3 flex items-center justify-between'>
        <span className='text-[11px] text-gray-500'>{productCount ? `${productCount} product${productCount!==1?'s':''}` : 'No products'}</span>
        <Link to={`/trackers/${id}`} className='text-brandGreen text-xs font-medium hover:underline'>View</Link>
      </div>
    </div>
  );
};

export default TrackerCard;
