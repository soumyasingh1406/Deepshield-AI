import { Bell, Search, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar({ setMobileOpen }: { setMobileOpen: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
      scrolled ? 'bg-cyber-base/80 backdrop-blur-md border-b border-cyber-border shadow-lg' : 'bg-transparent'
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
        >
           <span className="sr-only">Open sidebar</span>
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
           </svg>
        </button>
        
        <div className="hidden sm:flex relative items-center">
          <Search className="w-4 h-4 absolute left-3 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search network logs..." 
            className="w-64 bg-black/40 border border-cyber-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/50 transition-all font-mono placeholder-gray-600 text-gray-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-cyber-blue transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyber-cyan text-[10px] font-bold flex flex-col justify-center items-center text-black rounded-full animate-pulse"></span>
        </button>
        
        <div className="h-8 w-8 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue cursor-pointer hover:bg-cyber-blue/20 transition-colors">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
