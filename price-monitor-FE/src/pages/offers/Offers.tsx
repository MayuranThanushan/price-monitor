import React from 'react';
import { useAuthStore } from '../../context/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { listOffersGrouped } from '../../api';
import StateBlock from '../../components/ui/StateBlock';
import { useBackendGuard } from '../../hooks/useBackendGuard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import OfferCard from '../../components/dashboard/OfferCard';
import PageContainer from '../../components/ui/PageContainer';
import SectionClean from '../../components/ui/SectionClean';

interface OfferItem {
  _id: string;
  bank: string;
  cardType?: string;
  title: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  expiresAt?: string;
  highlight?: boolean; // normalized
  highlighted?: boolean; // backend variant
}

interface OfferGroup { shop: string; offers: OfferItem[]; }

export default function Offers(){
  const { user } = useAuthStore();
  const { data, isLoading, isError, error } = useQuery(['offers-grouped'], () => listOffersGrouped().then((r:any)=>r.data));
  useBackendGuard({ isError, error });
  const raw = data?.data;
  let groups: OfferGroup[] = [];
  if (Array.isArray(raw)) {
    groups = raw as OfferGroup[];
  } else if (raw && typeof raw === 'object') {
    groups = Object.entries(raw as Record<string, OfferItem[]>).map(([shop, offers]) => ({ shop, offers }));
  }
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean title='Shop Offers' />
        {isLoading && <StateBlock variant='loading' />}
        {isError && <StateBlock variant='error' />}
        {!isLoading && !isError && groups.length === 0 && <StateBlock variant='empty' message={user?.role==='admin' ? 'No offers aggregated.' : 'No data to show.'} />}
          <SectionClean>
        <div className='grid gap-4 lg:grid-cols-2 mt-4'>
          {groups.map(g => (
            <div key={g.shop} className='flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-brandBlack'>{g.shop}</h2>
                <span className='text-xs text-gray-500'>{g.offers.length} offer{g.offers.length!==1?'s':''}</span>
              </div>
              <ul className='space-y-4'>
                {g.offers.map(o => (
                  <li key={o._id} className='space-y-2'>
                    <OfferCard
                      id={o._id}
                      bank={o.bank}
                      title={o.title}
                      description={o.description || ''}
                      expires={o.expiresAt ? new Date(o.expiresAt).toLocaleDateString() : undefined}
                      highlight={o.highlighted || o.highlight}
                    />
                    <div className='flex flex-wrap items-center gap-2 text-xs'>
                      {o.cardType && <span className='px-2 py-1 rounded bg-gray-100 text-gray-600'>{o.cardType}</span>}
                      {o.discountValue != null && (
                        <span className='font-medium text-brandGreen'>
                          {o.discountType === 'percent' && `${o.discountValue}% off`}
                          {o.discountType === 'amount' && `$${o.discountValue} off`}
                          {o.discountType === 'cashback' && `${o.discountValue}% cashback`}
                          {o.discountType === 'other' && 'Special offer'}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
          </SectionClean>
      </PageContainer>
    </DashboardLayout>
  );
}
