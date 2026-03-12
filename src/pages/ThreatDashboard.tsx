import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Globe, AlertTriangle, ShieldX, ShieldCheck, Database, FileDigit, Activity } from 'lucide-react';
import { io } from 'socket.io-client';

interface DashboardStats {
  totalFilesAnalyzed: number;
  highRiskMediaDetected: number;
  evidenceStored: number;
  systemStatus: string;
}

export default function ThreatDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFilesAnalyzed: 0,
    highRiskMediaDetected: 0,
    evidenceStored: 0,
    systemStatus: 'CONNECTING...',
  });

  const [threats, setThreats] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('Never');

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => console.error('Error fetching dashboard stats:', error));

    const socket = io("http://localhost:5000");

    socket.on("newThreat", (data) => {
      setThreats((prev) => {
        const updated = [data, ...prev];
        return updated.slice(0, 50);
      });
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return () => {
      socket.disconnect();
    };
  }, []);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:col-span-3">
        {/* Card 1: Harassment Media Scanned */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden text-center group">
          <div className="absolute inset-0 bg-cyber-blue/5 group-hover:bg-cyber-blue/10 transition-colors pointer-events-none"></div>
          <FileDigit className="w-12 h-12 text-cyber-blue mb-4" />
          <h2 className="text-gray-400 font-mono font-bold tracking-widest text-xs mb-1">MEDIA SCANNED</h2>
          <div className="text-4xl font-bold text-white">{stats.totalFilesAnalyzed}</div>
        </div>

        {/* Card 2: Potential Abuse Incidents Prevented */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden text-center group">
          <div className="absolute inset-0 bg-cyber-red/5 group-hover:bg-cyber-red/10 transition-colors pointer-events-none"></div>
          <AlertTriangle className={`w-12 h-12 text-cyber-red mb-4 ${stats.highRiskMediaDetected > 0 ? 'animate-pulse' : ''}`} />
          <h2 className="text-cyber-red font-mono font-bold tracking-widest text-xs mb-1">HIGH RISK MEDIA</h2>
          <div className="text-4xl font-bold text-white">{stats.highRiskMediaDetected}</div>
        </div>

        {/* Card 3: Protection System Status */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden text-center group">
          <div className="absolute inset-0 bg-cyber-green/5 group-hover:bg-cyber-green/10 transition-colors pointer-events-none"></div>
          <ShieldCheck className="w-12 h-12 text-cyber-green mb-4" />
          <h2 className="text-cyber-green font-mono font-bold tracking-widest text-xs mb-1">SYSTEM STATUS</h2>
          <div className="text-2xl font-bold text-white tracking-widest">{stats.systemStatus}</div>
        </div>

        {/* Card 4: Secured Evidence Records */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden text-center group">
          <div className="absolute inset-0 bg-cyber-cyan/5 group-hover:bg-cyber-cyan/10 transition-colors pointer-events-none"></div>
          <Database className="w-12 h-12 text-cyber-cyan mb-4" />
          <h2 className="text-cyber-cyan font-mono font-bold tracking-widest text-xs mb-1">EVIDENCE STORED</h2>
          <div className="text-4xl font-bold text-white">{stats.evidenceStored}</div>
        </div>
      </div>

      {/* Global Map Mockup */}
      <div className="md:col-span-3 glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyber-blue" />
            Active Threat Clusters
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Active Node Count:</span>
              <span className="text-cyber-cyan font-bold">{threats.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Last Telemetry:</span>
              <span className="text-cyber-blue">{lastUpdate}</span>
            </div>
          </div>
        </div>

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

          {/* Real-time Threat Nodes */}
          {threats.map((threat) => {
            const top = `${(90 - threat.lat) / 180 * 100}%`;
            const left = `${(threat.lng + 180) / 360 * 100}%`;
            
            let colorClass = "bg-yellow-500";
            if (threat.severity === "MEDIUM") colorClass = "bg-orange-500";
            if (threat.severity === "HIGH") colorClass = "bg-cyber-red";

            return (
              <div key={threat.id} className={`absolute w-3 h-3 rounded-full ${colorClass} group/node z-20 cursor-crosshair`} style={{ top, left, transform: 'translate(-50%, -50%)' }}>
                <motion.div
                  initial={{ transform: 'scale(1)', opacity: 0.8 }}
                  animate={{ transform: 'scale(3)', opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full ${colorClass}`}
                />
                
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover/node:opacity-100 transition-opacity z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-cyber-border rounded p-2 pointer-events-none drop-shadow-lg">
                  <div className="text-[10px] font-mono flex flex-col gap-1">
                    <span className="text-cyber-blue font-bold border-b border-cyber-blue/30 pb-1 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Threat Node Detected
                    </span>
                    <span className="text-gray-300">IP: {threat.ip}</span>
                    <span className="text-gray-300">Type: {threat.threatType}</span>
                    <span className={`${threat.severity === 'HIGH' ? 'text-cyber-red' : threat.severity === 'MEDIUM' ? 'text-orange-500' : 'text-yellow-500'} font-bold`}>
                      Severity: {threat.severity}
                    </span>
                    <span className="text-cyber-cyan text-[9px] mt-1 pt-1 border-t border-cyber-border/50">
                      Source: {threat.source}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Overlay Text Defaults */}
          {threats.length === 0 && (
            <div className="absolute bottom-4 left-4 p-2 bg-black/80 border border-cyber-border rounded font-mono text-[10px] text-cyber-cyan flex flex-col gap-1 z-10">
              <span className="text-gray-500 animate-pulse">Awaiting global telemetry streams...</span>
            </div>
          )}
          
          {threats.length > 0 && (
            <div className="absolute bottom-4 left-4 p-2 bg-black/80 border border-cyber-border rounded font-mono text-[10px] text-cyber-cyan flex flex-col gap-1 z-10">
               <span>LATEST THREAT: {threats[0].lat.toFixed(4)}° N, {threats[0].lng.toFixed(4)}° W</span>
               <span className="text-cyber-red flex items-center gap-1"><ShieldX className="w-3 h-3" /> Node Integrity Compromised</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
