import { motion } from 'framer-motion';
import { Hexagon, Globe, AlertTriangle, ShieldX, TrendingUp } from 'lucide-react';

export default function ThreatDashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white flex items-center gap-3 mb-2">
          <Hexagon className="w-8 h-8 text-cyber-blue" />
          Threat Intelligence Node
        </h1>
        <p className="text-gray-400 font-mono text-sm max-w-2xl">
          Global threat telemetry and real-time visualization of synthetic media distribution networks.
        </p>
        <p className="text-cyber-cyan/80 mt-1 font-mono text-sm max-w-2xl italic">
          Protecting women from synthetic media abuse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Threat Level Indicator */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden text-center group">
          <div className="absolute inset-0 bg-cyber-red/5 group-hover:bg-cyber-red/10 transition-colors pointer-events-none"></div>
          <AlertTriangle className="w-16 h-16 text-cyber-red mb-4 animate-pulse" />
          <h2 className="text-cyber-red font-mono font-bold tracking-widest text-sm mb-1">GLOBAL THREAT LEVEL</h2>
          <div className="text-4xl font-bold text-white">ELEVATED</div>
          <p className="text-gray-400 text-xs mt-4">DEFCON 3: High volume of coordinated political deepfakes detected across 4 major regions.</p>
        </div>

        {/* Attack Vectors */}
        <div className="glass-panel p-6 md:col-span-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,102,255,0.05),transparent_50%)]"></div>
          <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyber-blue" /> Dominant Attack Vectors (Last 72h)
          </h3>
          
          <div className="space-y-4">
            {[
              { name: 'Deepfake harassment campaigns', value: 45, color: 'bg-cyber-red' },
              { name: 'Non-consensual synthetic media', value: 30, color: 'bg-cyber-blue' },
              { name: 'Voice cloning scams/impersonation', value: 15, color: 'bg-cyber-cyan' },
              { name: 'Reputation attacks targeting women', value: 10, color: 'bg-cyber-green' },
            ].map((vector, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-300">{vector.name}</span>
                  <span className="text-gray-500">{vector.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-cyber-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${vector.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${vector.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Map Mockup */}
        <div className="md:col-span-3 glass-panel p-6">
          <h3 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyber-blue" />
            Active Threat Clusters
          </h3>
          
          <div className="h-64 sm:h-80 md:h-96 w-full rounded-lg border border-cyber-border bg-black/60 relative overflow-hidden flex items-center justify-center group">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Mock Continents / Map Outlines */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-contain" style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(180deg)' }}></div>

            {/* Radar Sweep */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -ml-[100%] -mt-[100%] border-r-2 border-cyber-blue opacity-30 origin-center"
              style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 240, 255, 0.4) 90deg, transparent 90deg)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />

            {/* Threat Nodes */}
            {[
              { top: '30%', left: '20%', size: 'w-4 h-4', delay: 0 }, // North America
              { top: '25%', left: '50%', size: 'w-3 h-3', delay: 1 }, // Europe
              { top: '45%', left: '75%', size: 'w-5 h-5', delay: 2 }, // Asia
              { top: '65%', left: '40%', size: 'w-2 h-2', delay: 0.5 }, // South America
            ].map((node, i) => (
              <div key={i} className={`absolute ${node.size} rounded-full bg-cyber-red`} style={{ top: node.top, left: node.left }}>
                <motion.div 
                  initial={{ transform: 'scale(1)', opacity: 0.8 }}
                  animate={{ transform: 'scale(4)', opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: node.delay }}
                  className="absolute inset-0 rounded-full bg-cyber-red"
                />
              </div>
            ))}
            
            {/* Overlay Text */}
            <div className="absolute bottom-4 left-4 p-2 bg-black/80 border border-cyber-border rounded font-mono text-[10px] text-cyber-cyan flex flex-col gap-1">
              <span>LAT: 40.7128° N, LNG: 74.0060° W</span>
              <span className="text-cyber-red flex items-center gap-1"><ShieldX className="w-3 h-3"/> Node Alpha Compromised</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
