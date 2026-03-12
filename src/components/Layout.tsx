import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-cyber-base overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Glow effect background */}
        <div className="absolute top-0 right-0 -mr-64 -mt-64 w-96 h-96 bg-cyber-blue/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-[128px] pointer-events-none"></div>

        <Navbar setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 z-10 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
