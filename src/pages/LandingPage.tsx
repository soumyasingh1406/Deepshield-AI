import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Lock, ScanLine, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const metrics = [
  { label: 'Harassment Media Scanned (24h)', value: '1,284', icon: ScanLine, color: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'border-cyber-blue/30' },
  { label: 'Potential Abuse Incidents Prevented', value: '47', icon: ShieldAlert, color: 'text-cyber-red', bg: 'bg-cyber-red/10', border: 'border-cyber-red/30' },
  { label: 'Protection System Status', value: '99.9%', icon: Activity, color: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/30' },
  { label: 'Secured Evidence Records', value: '8.4M', icon: Lock, color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', border: 'border-cyber-cyan/30' }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
            <span className="text-cyber-green font-mono text-sm tracking-widest">SYSTEM ONLINE</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight"
          >
            COMMAND <span className="text-gradient">CENTER</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-2 max-w-xl"
          >
            Global deepfake detection and incident response orchestration interface.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-cyber-cyan/80 mt-1 font-mono text-sm max-w-xl italic"
          >
            Technology for safer online spaces.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/analyzer" className="flex items-center gap-2 px-6 py-3 bg-cyber-blue/10 text-cyber-cyan border border-cyber-blue/50 rounded-lg hover:bg-cyber-blue/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all font-medium">
            <ScanLine className="w-5 h-5" />
            INITIATE SCAN
          </Link>
        </motion.div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.3 }}
              className={`glass-panel p-6 border ${metric.border} relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${metric.bg} blur-2xl -mr-10 -mt-10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-1">{metric.label}</p>
                  <h3 className="text-3xl font-bold text-white">{metric.value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${metric.bg} ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main action area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 glass-panel p-8 border-cyber-cyan/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8 text-cyber-cyan" />
                <h2 className="text-2xl font-bold text-white">Advanced Defense Protocol</h2>
              </div>
              <p className="text-gray-300 max-w-2xl leading-relaxed">
                Our neural network array is actively monitoring for synthetic media and deepfake signatures. Upload suspicious media to the analyzer to verify authenticity and log findings in the immutable evidence locker.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Link to="/analyzer" className="group p-4 rounded-xl bg-black/40 border border-cyber-border hover:border-cyber-cyan/50 transition-all flex items-start gap-4">
                <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium group-hover:text-cyber-cyan transition-colors">Analyzer Engine</h4>
                  <p className="text-sm text-gray-500 mt-1">Detect synthetic manipulation in video and audio.</p>
                </div>
              </Link>
              
              <Link to="/response" className="group p-4 rounded-xl bg-black/40 border border-cyber-border hover:border-cyber-blue/50 transition-all flex items-start gap-4">
                <div className="p-2 rounded-lg bg-cyber-blue/10 text-cyber-blue">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium group-hover:text-cyber-blue transition-colors">Rapid Response</h4>
                  <p className="text-sm text-gray-500 mt-1">Execute takedown procedures for detected threats.</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Status */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-panel p-6 flex flex-col"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyber-blue" />
            Live Intel Feed
          </h3>
          
          <div className="flex-1 space-y-4">
            {[
              { time: '10:42:05', msg: 'Deepfake harassment attempt detected (Confidence: 98%)', type: 'alert' },
              { time: '10:41:12', msg: 'Evidence secured for victim protection: SHA256[...8a2f]', type: 'info' },
              { time: '10:35:55', msg: 'Suspicious impersonation media flagged & notice dispatched', type: 'success' },
              { time: '10:30:11', msg: 'Neural model weights updated via P2P node', type: 'info' }
            ].map((log, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-gray-500 font-mono shrink-0">{log.time}</span>
                <span className={`${
                  log.type === 'alert' ? 'text-cyber-red' : 
                  log.type === 'success' ? 'text-cyber-green' : 'text-gray-300'
                }`}>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
          
          <Link to="/dashboard" className="mt-6 flex items-center justify-center gap-2 w-full text-sm text-cyber-blue hover:text-cyber-cyan transition-colors py-2 border border-transparent hover:border-cyber-blue/30 rounded-lg">
            View All Logs <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
