import React from 'react';

interface StateBlockProps {
  variant: 'loading' | 'error' | 'empty';
  message?: string; // custom empty message
  className?: string;
}

export default function StateBlock({ variant, message, className }: StateBlockProps){
  const base = 'text-sm rounded-md border p-4';
  if(variant === 'loading'){
    return <div className={`${base} border-gray-100 bg-white animate-pulse ${className||''}`}>Loading...</div>;
  }
  if(variant === 'error'){
    return <div className={`${base} border-red-100 bg-red-50 text-red-700 ${className||''}`}>Something went wrong. Please try again later.</div>;
  }
  return <div className={`${base} border-gray-100 bg-white text-gray-600 ${className||''}`}>{message || 'No data to show.'}</div>;
}
