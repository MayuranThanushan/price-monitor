import React from 'react';

interface Props { title: string; description?: string; actions?: React.ReactNode; }

export const PageHeader: React.FC<Props> = ({ title, description, actions }) => (
  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
    <div>
      <h1 className='text-lg font-semibold tracking-tight text-brandBlack/90'>{title}</h1>
      {description && <p className='text-sm text-gray-600 mt-1'>{description}</p>}
    </div>
    {actions && <div className='flex items-center gap-2'>{actions}</div>}
  </div>
);

export default PageHeader;
