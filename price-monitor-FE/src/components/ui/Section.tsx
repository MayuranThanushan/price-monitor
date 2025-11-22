import React from 'react';

interface SectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

// Provides a consistent vertical rhythm across pages.
// Every section gets top margin except the first.
export const Section: React.FC<SectionProps> = ({ title, description, actions, children, className='' }) => {
  return (
    <section className={`mt-12 first:mt-0 ${className}`}>      {(title || actions) && (
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4'>
          <div>
            {title && <h2 className='text-lg font-semibold text-brandBlack'>{title}</h2>}
            {description && <p className='text-sm text-gray-600'>{description}</p>}
          </div>
          {actions && <div className='flex items-center gap-2'>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export default Section;
