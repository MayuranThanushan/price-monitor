import React from 'react';
import Sidebar from './Sidebar';
import TopBar from '../dashboard/TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../../api/healthAPI';
import { HealthBadge } from '../ui/HealthBadge';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { data, isLoading, isError } = useQuery(['health-badge'], () => {
    const start = Date.now();
    return getHealth().then(r => ({ ...r.data, latency: Date.now() - start }));
  }, { refetchInterval: 30000 });
  return (
    <div className='min-h-screen w-full bg-gray-50'>
      <Sidebar />
      <div className='ml-60 flex flex-col min-h-screen'>
        <TopBar />
        <main className='flex-1 overflow-y-auto'>
          {children}
        </main>
        <footer className='w-full py-2 px-4 border-t border-gray-200 bg-white text-right'>
          <HealthBadge ok={!!data && !isError} latency={data?.latency} />
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
