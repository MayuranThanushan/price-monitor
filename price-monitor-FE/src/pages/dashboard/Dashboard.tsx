import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics } from '../../api/metricsAPI'
import { getHealth } from '../../api/healthAPI'
import { getCategoryStats } from '../../api/categoryStatsAPI'
import { listOffersGrouped } from '../../api/offersAPI'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageContainer from '../../components/ui/PageContainer'
import SectionClean from '../../components/ui/SectionClean'
import StateBlock from '../../components/ui/StateBlock'
import { useBackendGuard } from '../../hooks/useBackendGuard'
import StatCard from '../../components/dashboard/StatCard'
import TrackerCard, { TrackerCardProps } from '../../components/dashboard/TrackerCard'
import OfferCard from '../../components/dashboard/OfferCard'
import Button from '../../components/ui/Button'
import { Plus } from 'lucide-react'

export default function Dashboard(){
  const { data: statsData, isLoading: statsLoading, isError: statsError, error: statsErr } = useQuery(['category-stats'], () => getCategoryStats().then(r=>r.data), { refetchOnWindowFocus:false })
  const { data: metricsData, isError: metricsError, error: metricsErr } = useQuery(['dashboard-metrics'], () => getDashboardMetrics().then(r=>r.data), { refetchOnWindowFocus:false })
  const { data: healthData, isLoading: healthLoading, isError: healthError } = useQuery(['health'], () => getHealth().then(r=>r.data), { refetchOnWindowFocus:false, refetchInterval: 60000 })
  const { data: offersData, isLoading: offersLoading, isError: offersError } = useQuery(['grouped-offers'], () => listOffersGrouped().then((r:any)=>r.data), { refetchOnWindowFocus:false })
  useBackendGuard({ isError: statsError, error: statsErr })
  useBackendGuard({ isError: metricsError, error: metricsErr })

  const trackers: TrackerCardProps[] = (statsData?.data || []).map((c:any)=>{
    // derive trend relative to midpoint between lowest & highest
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
    } as TrackerCardProps
  })

  const productsTracked = !metricsError ? metricsData?.data?.productsTracked : null
  const alertsToday = !metricsError ? metricsData?.data?.alertsToday : null
  const activeTrackers = !metricsError ? metricsData?.data?.activeTrackers : null
  // offersData expected shape: { data: [{ shop: string, offers: Offer[] }] }
  const flattenedOffers = (offersData?.data || []).flatMap((g:any) => g.offers || [])

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean title='Overview'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
            <StatCard label='Active Trackers' value={activeTrackers ?? 'No data'} />
            <StatCard label='Products Tracked' value={productsTracked ?? 'No data'} />
            <StatCard label='Alerts Today' value={alertsToday ?? 'No data'} />
            <StatCard label='Offers Available' value={flattenedOffers.length || (offersLoading ? 'Loading...' : offersError ? 'No data' : '0')} />
            <StatCard label='API Uptime (s)' value={healthLoading ? '...' : healthError ? 'Down' : Math.floor(healthData?.uptime ?? 0)} />
          </div>
        </SectionClean>
        <div className='grid lg:grid-cols-3 gap-8 mt-10'>
          <div className='lg:col-span-2'>
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
            {statsLoading && <StateBlock variant='loading' />}
            {statsError && <StateBlock variant='error' />}
            {!statsLoading && !statsError && trackers.length === 0 && <StateBlock variant='empty' message='No data to show.' />}
            {!statsLoading && !statsError && trackers.length > 0 && (
              <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
                {trackers.map(t => <TrackerCard key={t.id} {...t} />)}
              </div>
            )}
          </div>
          <div>
            <SectionClean title='Card & Bank Offers' />
            {offersLoading && <StateBlock variant='loading' />}
            {offersError && <StateBlock variant='error' />}
            {!offersLoading && !offersError && flattenedOffers.length === 0 && <StateBlock variant='empty' message='No data to show.' />}
            {!offersLoading && !offersError && flattenedOffers.length > 0 && (
              <div className='space-y-4 mt-4'>
                {flattenedOffers.map((o:any) => <OfferCard key={o._id || o.id} {...o} />)}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  )
}
