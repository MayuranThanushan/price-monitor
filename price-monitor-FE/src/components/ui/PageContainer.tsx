import React from 'react';

interface Props { children: React.ReactNode; className?: string }

// Page wrapper: unified max width & base padding; sections handle vertical rhythm.
export const PageContainer: React.FC<Props> = ({ children, className = '' }) => (
  <div className={`mx-auto px-6 py-8 ${className}`}>{children}</div>
);

export default PageContainer;
