import { motion } from 'framer-motion';
import { AlertCircle, FileWarning, Scale, Send, ShieldAlert, FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    icon: FileWarning,
    title: 'Phase 1: Secure Evidence',
    desc: 'Do not simply delete or report the media. First, obtain a verifiable cryptographic hash.',
    details: 'Use the DeepShield Analyzer to generate an immutable SHA-256 hash. Once logged in the Evidence Locker, the hash serves as proof that the media existed in its current form at this precise timestamp, vital for legal proceedings.'
  },
  {
    icon: ShieldAlert,
    title: 'Phase 2: Report Harassment',
    desc: 'Submit targeted takedown requests to the host platform\'s Trust & Safety team.',
    details: 'Most platforms (Twitter/X, Meta, TikTok) have explicit policies against non-consensual synthetic media (NCSM) and harassment. Cite their specific Terms of Service related to "Synthetic Media" or "Harassment/Impersonation" in your report.'
  },
  {
    icon: FileText,
    title: 'Phase 3: Platform Takedown Request',
    desc: 'If the media uses your identity without consent, file a formal takedown request or DMCA.',
    details: 'While deepfakes challenge traditional copyright, the underlying source material often belongs to you, and the use of your likeness without consent violates platform guidelines. Generating an automated notice through DeepShield provides a strong request for immediate removal of impersonation material.'
  },
  {
    icon: Scale,
    title: 'Phase 4: Legal & Safety Support',
    desc: 'For persistent threats, escalation to law enforcement or dedicated support groups is highly recommended.',
    details: 'DeepShield provides exported logs (CSV format) from the Evidence Locker which can be presented to cybercrime units. Reach out to women cybercrime helplines, digital safety resources, and online harassment reporting guidance for comprehensive support and protection.'
  }
];

export default function ResponseToolkit() {
  const [activeStep, setActiveStep] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white flex items-center gap-3 mb-2">
            <AlertCircle className="w-8 h-8 text-cyber-blue" />
            Response Toolkit
          </h1>
          <p className="text-gray-400 font-mono text-sm max-w-2xl">
            Safety guide for victims of synthetic media abuse. Follow these structured protocols to secure evidence and correctly execute reporting and takedown actions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
        {/* Playbook Steps */}
        <div className="md:col-span-5 space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`glass-panel p-4 cursor-pointer transition-all border-l-4 ${isActive ? 'bg-cyber-blue/5 border-cyber-blue' : 'border-transparent hover:border-cyber-border'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-cyber-blue/20 text-cyber-cyan' : 'bg-black/40 text-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{step.title}</h3>
                  </div>
                  <ChevronRight className={`w-5 h-5 ml-auto transition-transform ${isActive ? 'text-cyber-blue rotate-90' : 'text-gray-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Playbook Details */}
        <div className="md:col-span-7">
          {activeStep !== null ? (
             <motion.div 
               key={activeStep}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="glass-panel p-8 min-h-[400px] flex flex-col relative overflow-hidden"
             >
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 {(() => { const Icon = steps[activeStep].icon; return <Icon className="w-48 h-48" />; })()}
               </div>
               
               <h2 className="text-2xl font-bold text-white mb-2">{steps[activeStep].title}</h2>
               <p className="text-cyber-blue font-mono text-sm mb-6 pb-4 border-b border-cyber-border">
                 {steps[activeStep].desc}
               </p>
               
               <div className="text-gray-300 leading-relaxed mb-8 flex-1">
                 <p>{steps[activeStep].details}</p>
                 
                 {activeStep === 2 && (
                   <div className="mt-6 p-4 bg-black/40 border border-cyber-border rounded-lg font-mono text-xs text-gray-400">
                     <p className="mb-2 text-cyber-cyan">// DMCA TEMPLATE FRAGMENT</p>
                     <p>I am the copyright owner of the original media used to generate the synthetic content located at [URL]. This constitutes an unauthorized derivative work under 17 U.S.C. § 106...</p>
                   </div>
                 )}
               </div>

               <div className="mt-auto">
                 <button className="flex items-center justify-center gap-2 w-full py-3 bg-cyber-blue text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
                   <Send className="w-4 h-4" /> 
                   {activeStep === 0 ? 'Go to Analyzer' : activeStep === 2 ? 'Generate Notice' : 'Acknowledge Step'}
                 </button>
               </div>
             </motion.div>
          ) : (
            <div className="glass-panel p-8 min-h-[400px] flex items-center justify-center text-gray-500 font-mono">
              Select a playbook phase to view protocols.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
