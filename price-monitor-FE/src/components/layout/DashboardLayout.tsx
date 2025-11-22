import React from 'react';
import Sidebar from './Sidebar';
import TopBar from '../dashboard/TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
        <div className='min-h-screen w-full bg-gray-50'>
      <Sidebar />
          <div className='ml-60 flex flex-col min-h-screen'>
        <TopBar />
            <main className='flex-1 overflow-y-auto'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
