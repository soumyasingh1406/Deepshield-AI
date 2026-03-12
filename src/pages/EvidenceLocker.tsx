import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, FileText, Download, CheckCircle2, ShieldAlert, Shield, Loader2 } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface EvidenceRecord {
  id: string;
  filename: string;
  sha256: string;
  riskLevel: string;
  timestamp: string;
  integrityStatus?: 'VERIFIED' | 'HASH MISMATCH';
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
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEvidence = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/evidence')
      .then((res) => res.json())
      .then((data) => {
        setEvidenceList(data);
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

  const handleExportCSV = () => {
    const headers = ['Evidence ID', 'File Name', 'SHA-256 Hash', 'Risk Level', 'Timestamp'];
    const csvContent = evidenceList.map((item) => [
      item.id,
      `"${item.filename}"`,
      item.sha256,
      item.riskLevel,
      `"${new Date(item.timestamp).toLocaleString()}"`
    ].join(','));
    
    const csvStr = headers.join(',') + '\n' + csvContent.join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'evidence_ledger.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleVerifyClick = (id: string) => {
    setVerifyingId(id);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileVerify = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && verifyingId) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileData = event.target?.result;
        if (typeof fileData === 'string') {
          const generatedHash = CryptoJS.SHA256(CryptoJS.enc.Latin1.parse(fileData)).toString(CryptoJS.enc.Hex);
          
          const updatedList = evidenceList.map(item => {
            if (item.id === verifyingId) {
              return {
                ...item,
                integrityStatus: (item.sha256 === generatedHash ? 'VERIFIED' : 'HASH MISMATCH') as 'VERIFIED' | 'HASH MISMATCH'
              };
            }
            return item;
          });

          setEvidenceList(updatedList);
        }
        setVerifyingId(null);
      };

      reader.readAsBinaryString(file);
    } else {
      setVerifyingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileVerify} 
        className="hidden" 
      />
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
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-cyber-border text-gray-300 hover:text-white rounded-lg hover:border-cyber-cyan transition-all font-mono text-sm">
            <Download className="w-4 h-4" /> Export Ledger (CSV)
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-black/50 text-gray-400 border-b border-cyber-border">
              <tr>
                <th className="p-4 font-medium uppercase tracking-wider">ID / Target File</th>
                <th className="p-4 font-medium uppercase tracking-wider hidden md:table-cell">Source</th>
                <th className="p-4 font-medium uppercase tracking-wider">SHA-256 Cryptographic Hash</th>
                <th className="p-4 font-medium uppercase tracking-wider">Integrity Status</th>
                <th className="p-4 font-medium uppercase tracking-wider text-right">Risk Level</th>
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
              ) : evidenceList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">
                    <p>No evidence records found.</p>
                  </td>
                </tr>
              ) : (
                evidenceList.map((item) => (
                  <motion.tr variants={itemVariants} key={item.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-cyber-blue shrink-0" />
                        <div>
                          <div className="font-bold text-white group-hover:text-cyber-blue transition-colors">
                            {item.id}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
                            {item.filename}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="px-2 py-1 bg-cyber-base rounded text-xs border border-cyber-border">System</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-cyber-cyan truncate max-w-[150px] sm:max-w-xs lg:max-w-md">{item.sha256}</span>
                        <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.integrityStatus ? (
                        item.integrityStatus === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-green/10 text-cyber-green text-xs font-bold border border-cyber-green/30">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-red/10 text-cyber-red text-xs font-bold border border-cyber-red/30">
                            <ShieldAlert className="w-3 h-3" /> HASH MISMATCH
                          </span>
                        )
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleVerifyClick(item.id); }}
                          className="flex items-center gap-2 px-3 py-1 bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue hover:text-black rounded transition-all font-mono text-xs"
                        >
                          <Shield className="w-3 h-3" /> Verify Integrity
                        </button>
                      )}
                    </td>
                    <td className="p-4 text-right">
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
