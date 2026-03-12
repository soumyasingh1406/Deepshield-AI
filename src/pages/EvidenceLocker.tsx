import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, FileText, Download, CheckCircle2, ShieldAlert, Shield } from 'lucide-react';
import CryptoJS from 'crypto-js';

const mockEvidence = [
  { id: 'EV-001', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', target: 'ceo_statement_fake.mp4', time: '2023-11-14T08:22:10Z', status: 'verified_fake', source: 'Twitter API' },
  { id: 'EV-002', hash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', target: 'news_report_alt.jpg', time: '2023-11-14T11:45:00Z', status: 'verified_fake', source: 'Manual Upload' },
  { id: 'EV-003', hash: '4a6b9a8fcf2b71c2621ad77e77d853b05be5aab34f738f712574fa4507a7e8ea', target: 'political_rally_raw.mp4', time: '2023-11-13T16:10:33Z', status: 'authentic', source: 'News Archiver Node' },
  { id: 'EV-004', hash: 'c2a6fdf9a37e8c3b1a8d438cf1df8c281df69e9a5840d876bc8b3d875dc9d5e3', target: 'audio_leak_q3.wav', time: '2023-11-13T09:05:12Z', status: 'verified_fake', source: 'Endpoint Agent' },
  { id: 'EV-005', hash: 'b6589fc6ab0dc82cf12099d1c2d40ab994e8410cce5b5baf00f7e4ac87d8123', target: 'press_briefing.avi', time: '2023-11-12T22:30:00Z', status: 'authentic', source: 'Manual Upload' },
];

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
  const [evidenceList, setEvidenceList] = useState<any[]>(mockEvidence);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('evidence_locker');
    if (stored) {
      try {
        setEvidenceList(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse evidence_locker from localStorage");
      }
    } else {
      localStorage.setItem('evidence_locker', JSON.stringify(mockEvidence));
    }
    
    // Listen for storage events to update the list if it's changed in another tab or programmatically
    const handleStorageChange = () => {
      const updatedStored = localStorage.getItem('evidence_locker');
      if (updatedStored) {
        try {
          setEvidenceList(JSON.parse(updatedStored));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleExportCSV = () => {
    const headers = ['Evidence ID', 'File Name', 'Source', 'Timestamp', 'SHA-256 Hash', 'Status'];
    const csvContent = evidenceList.map((item: any) => [
      item.id,
      `"${item.target}"`,
      `"${item.source}"`,
      `"${item.time}"`,
      item.hash,
      item.status === 'verified_fake' ? 'Fake' : 'Real'
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
                integrityStatus: item.hash === generatedHash ? 'VERIFIED' : 'HASH MISMATCH'
              };
            }
            return item;
          });

          setEvidenceList(updatedList);
          localStorage.setItem('evidence_locker', JSON.stringify(updatedList));
          window.dispatchEvent(new Event('storage'));
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
                <th className="p-4 font-medium uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-cyber-border text-gray-300"
            >
              {evidenceList.map((item) => (
                <motion.tr variants={itemVariants} key={item.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-cyber-blue shrink-0" />
                      <div>
                        <div className="font-bold text-white group-hover:text-cyber-blue transition-colors">{item.id}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">{item.target}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="px-2 py-1 bg-cyber-base rounded text-xs border border-cyber-border">{item.source}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-cyber-cyan truncate max-w-[150px] sm:max-w-xs lg:max-w-md">{item.hash}</span>
                      <span className="text-[10px] text-gray-500">{new Date(item.time).toLocaleString()}</span>
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
                    {item.status === 'verified_fake' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-red/10 text-cyber-red text-xs font-bold border border-cyber-red/30">
                        <ShieldAlert className="w-3 h-3" /> FAKE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-green/10 text-cyber-green text-xs font-bold border border-cyber-green/30">
                        <CheckCircle2 className="w-3 h-3" /> REAL
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
