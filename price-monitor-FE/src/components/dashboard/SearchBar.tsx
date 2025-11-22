import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  const [q, setQ] = useState('');
  return (
    <div className='flex items-center w-full bg-gray-100 rounded-md px-3 py-2 border border-gray-200'>
      <svg className='h-5 w-5 text-gray-500' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z' />
      </svg>
      <input
        placeholder='Search trackers or products...'
        className='bg-transparent outline-none ml-2 flex-1 text-sm'
        value={q}
        onChange={e=>setQ(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
