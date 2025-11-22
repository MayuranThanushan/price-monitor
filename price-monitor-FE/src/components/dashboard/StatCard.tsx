import React from 'react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  trend?: number; // percentage, positive or negative
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend }) => {
  return (
    <div className='bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col gap-2'>
      <div className='text-xs uppercase tracking-wide text-gray-500 font-medium'>{label}</div>
      <div className='text-2xl font-semibold text-brandBlack'>{value}</div>
      {typeof trend === 'number' && (
        <div className={`text-xs font-medium ${trend >= 0 ? 'text-brandGreen' : 'text-red-600'}`}>{trend >= 0 ? '+' : ''}{trend}%</div>
      )}
    </div>
  );
};

export default StatCard;
