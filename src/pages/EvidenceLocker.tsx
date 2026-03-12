import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, FileText, Download, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';

interface EvidenceRecord {
  id: string;
  filename: string;
  sha256: string;
  riskLevel: string;
  timestamp: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function EvidenceLocker() {
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvidence = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/evidence')
      .then((res) => res.json())
      .then((data) => {
        setEvidence(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching evidence:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white flex items-center gap-3">
            <Lock className="w-8 h-8 text-cyber-blue" />
            Immutable Evidence Locker
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm max-w-2xl">
            Securely store evidence of manipulated media used for harassment or identity misuse. Each file is cryptographically hashed to preserve proof for reporting or legal action.
          </p>
          <p className="text-cyber-cyan/80 mt-1 font-mono text-sm max-w-2xl italic">
            You deserve a safe digital identity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fetchEvidence}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-blue/10 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue/20 rounded-lg transition-all font-mono text-sm"
          >
            Refresh records
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-cyber-border text-gray-300 hover:text-white rounded-lg hover:border-cyber-cyan transition-all font-mono text-sm">
            <Download className="w-4 h-4" /> Export Ledger (CSV)
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-black/50 text-gray-400 border-b border-cyber-border">
              <tr>
                <th className="p-4 font-medium uppercase tracking-wider">ID</th>
                <th className="p-4 font-medium uppercase tracking-wider">Filename</th>
                <th className="p-4 font-medium uppercase tracking-wider">SHA256 Hash</th>
                <th className="p-4 font-medium uppercase tracking-wider">Risk Level</th>
                <th className="p-4 font-medium uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-cyber-border text-gray-300"
            >
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-cyber-blue font-mono">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>Loading records from secure endpoints...</p>
                  </td>
                </tr>
              ) : evidence.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">
                    <p>No evidence records found.</p>
                  </td>
                </tr>
              ) : (
                evidence.map((item) => (
                  <motion.tr variants={itemVariants} key={item.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="p-4">
                      <span className="font-bold text-white group-hover:text-cyber-blue transition-colors text-xs truncate max-w-[150px] sm:max-w-xs">{item.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-cyber-blue shrink-0" />
                        <span className="text-sm truncate max-w-[150px] sm:max-w-[200px]">{item.filename}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-cyber-cyan truncate max-w-[150px] sm:max-w-xs lg:max-w-md">{item.sha256}</span>
                    </td>
                    <td className="p-4">
                      {item.riskLevel === 'HIGH' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-red/10 text-cyber-red text-xs font-bold border border-cyber-red/30">
                          <ShieldAlert className="w-3 h-3" /> HIGH
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-green/10 text-cyber-green text-xs font-bold border border-cyber-green/30">
                          <CheckCircle2 className="w-3 h-3" /> LOW
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
