import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F8FD] flex flex-col font-sans">
      <AppNavbar />
      
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <AppSidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};
