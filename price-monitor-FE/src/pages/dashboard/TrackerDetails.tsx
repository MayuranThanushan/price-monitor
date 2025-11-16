import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/axiosClient'
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
    <div className='max-w-6xl mx-auto'>
      <h2 className='text-xl font-semibold mb-4'>Tracker Details</h2>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-2 bg-white p-4 rounded shadow'>
          <h3 className='font-semibold mb-2'>Products</h3>
          <div className='space-y-2'>
            {products.map((p:any)=>(
              <div key={p._id} className='flex justify-between p-2 border rounded'>
                <div>
                  <div className='font-medium'>{p.title}</div>
                  <div className='text-sm text-gray-500'>{p.url}</div>
                </div>
                <div className='text-right'>
                  <div className='font-semibold'>Rs {p.currentPrice}</div>
                  <div className='text-sm text-gray-500'>{p.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-semibold mb-2'>Price Trend</h3>
          {chartData.length ? (
            <ResponsiveContainer width='100%' height={200}>
              <LineChart data={chartData}>
                <Line dataKey='price' stroke='#3b82f6' strokeWidth={2} />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className='text-sm text-gray-500'>No history</div>}
        </div>
      </div>
    </div>
  )
}
