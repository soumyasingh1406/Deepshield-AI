import { motion } from 'framer-motion';
import { ShieldAlert, AlertCircle, Save, Share2, FileText, Lock, PhoneCall, ExternalLink, ShieldCheck, EyeOff, ImageOff, UserX, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmergencySupport() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white flex items-center gap-3 mb-2">
          <PhoneCall className="w-8 h-8 text-cyber-blue" />
          Emergency Support
        </h1>
        <p className="text-gray-400 font-mono text-sm max-w-2xl">
          Immediate help and guidance for victims of deepfake harassment or identity misuse.
        </p>
      </div>

      {/* Safety Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 border-l-4 border-cyber-red bg-cyber-red/5 flex items-start gap-4"
      >
        <AlertCircle className="w-6 h-6 text-cyber-red shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Safety Alert</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            If you are experiencing deepfake harassment or impersonation online, you are not alone. Follow these steps to protect yourself and preserve evidence.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Immediate Action Steps */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyber-red" />
            Immediate Action Steps
          </h3>
          <div className="space-y-4">
            {[
              { icon: UserX, text: 'Do not panic: Automated tools and support teams are available.' },
              { icon: Save, text: 'Save the manipulated media as evidence locally.' },
              { icon: Share2, text: 'Avoid resharing the content (do not quote tweet or forward).' },
              { icon: FileText, text: 'Document usernames, URLs, and timestamps manually.' },
              { icon: Lock, text: 'Use the DeepShield Evidence Locker to secure cryptographic proof.' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-cyber-border/50">
                <step.icon className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{step.text}</span>
              </div>
            ))}
          </div>
          
          <Link to="/locker" className="mt-6 flex items-center justify-center gap-2 w-full py-2 bg-cyber-blue/10 text-cyber-cyan border border-cyber-blue/30 rounded-lg hover:bg-cyber-blue/20 transition-all font-mono text-sm">
            <Lock className="w-4 h-4" /> Go to Evidence Locker
          </Link>
        </div>

        {/* Emergency Contacts (India) */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-cyber-blue" />
            Emergency Contacts (India)
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/40 border border-cyber-border cluster">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">Women Helpline</h4>
                  <p className="text-2xl font-mono font-bold text-cyber-blue mt-1">1091</p>
                </div>
                <div className="p-2 rounded-lg bg-cyber-blue/10 text-cyber-blue">
                  <PhoneCall className="w-5 h-5" />
                </div>
              </div>
              <button className="w-full py-2 text-sm text-cyber-blue border border-cyber-blue/30 hover:bg-cyber-blue/10 rounded-md transition-colors flex items-center justify-center gap-2">
                Contact Helpline
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-cyber-border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">Cyber Crime Helpline</h4>
                  <p className="text-2xl font-mono font-bold text-cyber-red mt-1">1930</p>
                </div>
                <div className="p-2 rounded-lg bg-cyber-red/10 text-cyber-red">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <button className="w-full py-2 text-sm text-cyber-red border border-cyber-red/30 hover:bg-cyber-red/10 rounded-md transition-colors flex items-center justify-center gap-2">
                Report Cybercrime
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-cyber-border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">National Cyber Portal</h4>
                  <p className="text-sm font-mono text-cyber-cyan mt-1 break-all">cybercrime.gov.in</p>
                </div>
                <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="w-full py-2 text-sm text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/10 rounded-md transition-colors flex items-center justify-center gap-2">
                Get Reporting Guide
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Safety Tips */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyber-green" />
          Protect Your Digital Identity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Lock, text: 'Enable two-factor authentication on all accounts' },
            { icon: EyeOff, text: 'Keep social media profiles private' },
            { icon: ImageOff, text: 'Avoid sharing sensitive images publicly' },
            { icon: ShieldAlert, text: 'Report suspicious or duplicate accounts immediately' },
            { icon: Settings, text: 'Regularly review account privacy settings' },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-black/20 border border-cyber-border/30 hover:border-cyber-green/30 transition-colors">
               <tip.icon className="w-5 h-5 text-cyber-green shrink-0" />
               <span className="text-sm text-gray-300">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support Message */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center p-6 border-t border-cyber-border mt-4"
      >
        <p className="text-cyber-cyan font-mono italic">
          "Technology should empower, not harm. DeepShield is built to help women protect their identity and respond safely to synthetic media abuse."
        </p>
      </motion.div>
    </div>
  );
}
