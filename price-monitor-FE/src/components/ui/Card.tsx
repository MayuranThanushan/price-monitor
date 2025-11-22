import React from 'react';

interface Props { children: React.ReactNode; className?: string; padded?: boolean; }

// Reusable surface container
export const Card: React.FC<Props> = ({ children, className = '', padded = true }) => (
  <div className={`bg-white border border-gray-100 rounded-lg shadow-sm ${padded ? 'p-6' : ''} ${className}`}>{children}</div>
);

export default Card;
