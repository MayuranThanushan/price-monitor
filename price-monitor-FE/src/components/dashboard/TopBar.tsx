import React from 'react';
import SearchBar from './SearchBar';
import NotificationsDropdown from './NotificationsDropdown';
import { useAuthStore } from '../../context/AuthStore';

const TopBar: React.FC = () => {
  const { user } = useAuthStore();
  const initials = (user?.name || user?.email || '?').charAt(0).toUpperCase();
  return (
    <div className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 gap-12'>
      <SearchBar />
      <div className='flex items-center gap-6'>
        <NotificationsDropdown />
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 rounded-md bg-brandGreen flex items-center justify-center text-white font-semibold text-sm'>{initials}</div>
          <div className='flex flex-col leading-tight max-w-[180px]'>
            <span className='text-sm font-semibold text-brandBlack truncate' title={user?.name || user?.email}>{user?.name || user?.email}</span>
            {user?.email && (
              <span className='text-xs text-gray-500 truncate' title={user.email}>{user.email}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
