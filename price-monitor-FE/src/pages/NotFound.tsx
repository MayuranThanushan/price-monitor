import React from 'react';

export default function NotFound(){
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold text-brandBlack'>404</h1>
        <p className='text-sm text-gray-600'>Page not found.</p>
        <a href='/dashboard' className='text-sm text-brandGreen font-medium hover:underline'>Go to Dashboard</a>
      </div>
    </div>
  );
}
