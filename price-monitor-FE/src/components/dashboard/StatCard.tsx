import React from 'react';

interface StatCardProps {
  label: string;
  value: unknown;
  trend?: number; // percentage, positive or negative
}

function normalizeValue(value: unknown): React.ReactNode {
  if (value == null) return 'No data';
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (value instanceof Error) return value.message;
  if (typeof value === 'object') {
    const anyVal: any = value;
    // common axios error shape
    if (anyVal.message) return String(anyVal.message);
    return JSON.stringify(anyVal);
  }
  return String(value);
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend }) => {
  const display = normalizeValue(value);
  return (
    <div className='bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col gap-2'>
      <div className='text-xs uppercase tracking-wide text-gray-500 font-medium'>{label}</div>
      <div className='text-2xl font-semibold text-brandBlack'>{display}</div>
      {typeof trend === 'number' && (
        <div className={`text-xs font-medium ${trend >= 0 ? 'text-brandGreen' : 'text-red-600'}`}>{trend >= 0 ? '+' : ''}{trend}%</div>
      )}
    </div>
  );
};

export default StatCard;
