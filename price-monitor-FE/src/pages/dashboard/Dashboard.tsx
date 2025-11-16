import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../api/categoryAPI'

export default function Dashboard(){
  const { data } = useQuery(['categories'], () => getCategories().then(r=>r.data), { refetchOnWindowFocus:false })
  const cats = data?.data || []
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='grid grid-cols-3 gap-4 mb-6'>
        <div className='bg-white p-4 rounded shadow'>Active trackers: {cats.length}</div>
        <div className='bg-white p-4 rounded shadow'>Products tracked: 0</div>
        <div className='bg-white p-4 rounded shadow'>Alerts (today): 0</div>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xl font-semibold'>Your Trackers</h3>
        <Link to='/trackers/new' className='bg-blue-600 text-white px-3 py-1 rounded'>+ New Tracker</Link>
      </div>

      <div className='space-y-3'>
        {cats.map((c:any)=>(
          <div key={c._id} className='bg-white p-4 rounded shadow flex justify-between items-center'>
            <div>
              <div className='font-semibold'>{c.name}</div>
              <div className='text-sm text-gray-500'>{c.categoryUrl}</div>
            </div>
            <div className='flex gap-2'>
              <Link to={`/trackers/${c._id}`} className='text-blue-600'>Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
