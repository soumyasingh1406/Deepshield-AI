import { useState, useEffect } from 'react';
import { Lock, FileText, Download, CheckCircle2, ShieldAlert } from 'lucide-react';

interface EvidenceRecord {
  id: string;
  filename: string;
  sha256: string;
  riskLevel: string;
  timestamp: string;
  status: string;
}

export default function EvidenceLocker() {
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);

  const [verificationResults, setVerificationResults] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('http://localhost:5000/api/evidence')
      .then((res) => res.json())
      .then((data) => setEvidence(data))
      .catch((err) => console.error(err));
  }, []);

  const handleExportCSV = () => {
    const headers = ['ID', 'Filename', 'SHA-256 Hash', 'Risk Level', 'Timestamp'];
    const csvContent = evidence.map((item) => [
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

  const verifyIntegrity = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/evidence/verify/${id}`);
      const data = await res.json();

      setVerificationResults(prev => ({
        ...prev,
        [id]: data.result
      }));

    } catch (err) {
      console.error(err);
    }
  };

  const getRowBg = (id: string) => {
    const status = verificationResults[id];
    if (status === 'TAMPERED') return 'bg-cyber-red/10 shadow-[inset_0_0_15px_rgba(255,0,50,0.3)]';
    if (status === 'VERIFIED') return 'bg-cyber-green/5';
    return '';
  };

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
                <th className="p-4 font-medium uppercase tracking-wider text-right">Risk Level</th>
                <th className="p-4 font-medium uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border text-gray-300">
              {evidence.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">
                    <p>No evidence records found. Analyze a file to store evidence.</p>
                  </td>
                </tr>
              ) : (
                evidence.map((item) => (
                  <tr key={item.id} className={`hover:bg-white/5 transition-all group ${getRowBg(item.id)}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-cyber-blue shrink-0" />
                        <div>
                          <div className="font-bold text-white group-hover:text-cyber-blue transition-colors">{item.id}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">{item.filename}</div>
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
                    <td className="p-4 text-right">
                      {item.riskLevel === 'HIGH' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-red/10 text-cyber-red text-xs font-bold border border-cyber-red/30">
                          <ShieldAlert className="w-3 h-3" /> HIGH
                        </span>
                      ) : item.riskLevel === 'MEDIUM' ? (
                         <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/30">
                          <ShieldAlert className="w-3 h-3" /> MEDIUM
                        </span>                     
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyber-green/10 text-cyber-green text-xs font-bold border border-cyber-green/30">
                          <CheckCircle2 className="w-3 h-3" /> LOW
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {verificationResults[item.id] ? (
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold border ${verificationResults[item.id] === 'VERIFIED' ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30' : 'bg-cyber-red/10 text-cyber-red border-cyber-red/30'}`}>
                           {verificationResults[item.id] === 'VERIFIED' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                           {verificationResults[item.id]}
                        </span>
                      ) : (
                        <button
                          className="px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black rounded text-xs transition-colors"
                          onClick={() => verifyIntegrity(item.id)}
                        >
                          Verify Integrity
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}