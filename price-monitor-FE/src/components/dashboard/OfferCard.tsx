import React from 'react';

export interface OfferCardProps {
  id: string;
  bank: string;
  title: string;
  description: string;
  expires?: string;
  highlight?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ bank, title, description, expires, highlight }) => {
  return (
    <div className={`rounded-lg p-4 border shadow-sm flex flex-col gap-2 ${highlight ? 'border-brandGreen bg-brandGreen/5' : 'border-gray-100 bg-white'}`}>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>{bank}</span>
        {highlight && <span className='text-xs font-medium text-brandGreen'>Featured</span>}
      </div>
      <h5 className='font-semibold text-brandBlack'>{title}</h5>
      <p className='text-sm text-gray-600 line-clamp-3'>{description}</p>
      {expires && <div className='text-xs text-gray-500'>Expires: {expires}</div>}
      <button className='mt-1 text-xs font-medium text-brandGreen hover:underline self-start'>View details</button>
    </div>
  );
};

export default OfferCard;
