import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/axiosClient'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageContainer from '../../components/ui/PageContainer'
import SectionClean from '../../components/ui/SectionClean'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function TrackerDetails(){
  const { id } = useParams()
  const { data } = useQuery(['trackerProducts', id], async ()=> {
    const res = await api.get(`/api/products/${id}`)
    return res.data
  }, { enabled: !!id })

  const products = data?.data || []

  // build sample chart data from first product history
  const chartData = products[0]?.history?.map((h:any)=> ({ date: new Date(h.date).toLocaleDateString(), price: h.price })) || []

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean title='Tracker Details' className='mt-10'>
        <div className='grid lg:grid-cols-3 gap-8 mt-4'>
          <div className='lg:col-span-2 bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
            <h3 className='font-semibold mb-3'>Products</h3>
            <div className='space-y-2'>
              {products.map((p:any)=>(
                <div key={p._id} className='flex justify-between p-2 border border-gray-200 rounded-md'>
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium truncate'>{p.title}</div>
                    <div className='text-xs text-gray-500 truncate'>{p.url}</div>
                  </div>
                  <div className='text-right w-32'>
                    <div className='font-semibold'>Rs {p.currentPrice}</div>
                    <div className={`text-[11px] ${p.trend==='DOWN'?'text-brandGreen':p.trend==='UP'?'text-red-600':'text-gray-500'}`}>{p.trend}</div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <div className='text-sm text-gray-500'>No products found.</div>}
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
            <h3 className='font-semibold mb-3'>Price Trend</h3>
            {chartData.length ? (
              <ResponsiveContainer width='100%' height={240}>
                <LineChart data={chartData}>
                  <Line dataKey='price' stroke='#16a34a' strokeWidth={2} />
                  <XAxis dataKey='date' tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className='text-sm text-gray-500'>No history</div>}
          </div>
        </div>
        </SectionClean>
      </PageContainer>
    </DashboardLayout>
  )
}
