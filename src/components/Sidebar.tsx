import { NavLink } from 'react-router-dom';
import { Shield, Activity, Lock, AlertTriangle, Terminal, X, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Command Center', icon: Activity },
  { path: '/analyzer', label: 'Deepfake Analyzer', icon: Scan },
  { path: '/locker', label: 'Evidence Locker', icon: Lock },
  { path: '/dashboard', label: 'Threat Intelligence', icon: Hexagon },
  { path: '/response', label: 'Response Toolkit', icon: AlertTriangle },
];

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-l-0 border-y-0 border-r-cyber-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-cyber-blue" />
            <span className="font-mono font-bold text-xl tracking-wider text-white">
              DEEP<span className="text-cyber-blue">SHIELD</span>
            </span>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`
                }
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="p-4 rounded-lg bg-cyber-darkBlue/10 border border-cyber-darkBlue/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-cyber-green"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyber-green animate-ping"></div>
              </div>
              <span className="text-xs font-mono text-cyber-green">SYSTEM SECURE</span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">NODE: DS-ALPHA-01</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Separate import for fix
function Scan({ className }: { className?: string }) {
  return <Terminal className={className} />;
}
