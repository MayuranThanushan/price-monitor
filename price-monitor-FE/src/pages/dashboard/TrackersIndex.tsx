import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategoryStats } from '../../api/categoryStatsAPI';
import StateBlock from '../../components/ui/StateBlock';
import { useBackendGuard } from '../../hooks/useBackendGuard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TrackerCard, { TrackerCardProps } from '../../components/dashboard/TrackerCard';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import SectionClean from '../../components/ui/SectionClean';

export default function TrackersIndex(){
  const { data: statsData, isLoading, isError, error } = useQuery(['category-stats'], () => getCategoryStats().then(r=>r.data), { refetchOnWindowFocus:false });
  useBackendGuard({ isError, error });
  const trackers: TrackerCardProps[] = (statsData?.data || []).map((c:any)=>{
    let trend: 'UP'|'DOWN'|'SAME' = 'SAME';
    if (c.lowestPrice != null && c.highestPrice != null && c.avgPrice != null) {
      const mid = (c.lowestPrice + c.highestPrice) / 2;
      if (c.avgPrice < mid * 0.95) trend = 'DOWN';
      else if (c.avgPrice > mid * 1.05) trend = 'UP';
    }
    return {
      id: c._id,
      name: c.label || c.name || 'Unnamed',
      url: c.baseUrl,
      currentPrice: c.lowestPrice != null ? c.lowestPrice : undefined,
      avgPrice: c.avgPrice != null ? c.avgPrice : undefined,
      targetPrice: c.maxPrice != null ? c.maxPrice : undefined,
      productCount: c.productCount,
      trend,
      status: c.productCount ? 'OK' : 'WATCH'
    } as TrackerCardProps;
  });

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean
          title='Trackers'
          actions={
            <Button
              to='/trackers/new'
              size='sm'
              variant='primary'
              leftIcon={<Plus size={14} />}
              className='shadow-sm'
            >
              New Tracker
            </Button>
          }
        />
        {isLoading && <StateBlock variant='loading' />}
        {isError && <StateBlock variant='error' />}
        {!isLoading && !isError && trackers.length === 0 && <StateBlock variant='empty' message='No data to show.' />}
        {!isLoading && !isError && trackers.length > 0 && (
          <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
            {trackers.map(t => <TrackerCard key={t.id} {...t} />)}
          </div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
