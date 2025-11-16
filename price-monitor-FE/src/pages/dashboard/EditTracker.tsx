import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories, deleteCategory } from '../../api/categoryAPI'

export default function TrackersPage(){
  const { data, refetch } = useQuery(['categories'], () => getCategories().then(r=>r.data))
  const cats = data?.data || []
  const remove = async (id:string) => {
    await deleteCategory(id)
    refetch()
  }
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Trackers</h2>
        <Link to='/trackers/new' className='bg-blue-600 text-white px-3 py-1 rounded'>+ New</Link>
      </div>
      <div className='space-y-2'>
        {cats.map((c:any)=>
          <div key={c._id} className='bg-white p-3 rounded shadow flex justify-between items-center'>
            <div>
              <div className='font-medium'>{c.name}</div>
              <div className='text-sm text-gray-500'>{c.categoryUrl}</div>
            </div>
            <div className='flex gap-2'>
              <Link to={`/trackers/${c._id}`} className='text-blue-600'>Open</Link>
              <button onClick={()=>remove(c._id)} className='text-red-600'>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
