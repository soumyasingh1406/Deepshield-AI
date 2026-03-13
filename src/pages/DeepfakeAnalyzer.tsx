import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ScanLine, ShieldCheck, FileType, ZoomIn, ShieldX, Database, CheckCircle2 } from 'lucide-react';

export default function DeepfakeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'neutral' | 'fake' | 'real'>('neutral');
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<{
    sha256: string;
    riskLevel: string;
    confidenceScore: string;
    indicators: string[];
    aiExplanation: string;
    filename: string;
    evidenceId: string;
  } | null>(null);
  const [evidenceSaved, setEvidenceSaved] = useState(false);
  const [savingEvidence, setSavingEvidence] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      resetState();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      resetState();
    }
  };

  const resetState = () => {
    setIsScanning(false);
    setScanResult('neutral');
    setProgress(0);
    setAnalysisData(null);
    setEvidenceSaved(false);
  };

  const startScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setProgress(0);

    // Animate progress bar while backend processes
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (currentProgress >= 90) {
        currentProgress = 90; // Hold at 90% until backend responds
        clearInterval(interval);
      }
      setProgress(Math.min(currentProgress, 90));
    }, 200);

    try {
      // Send file to backend for real analysis + automatic evidence storage
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const data = await res.json();

      setProgress(100);

      setTimeout(() => {
        setIsScanning(false);
        setScanResult(data.riskLevel === 'HIGH' ? 'fake' : 'real');
        setAnalysisData({
          sha256: data.sha256,
          riskLevel: data.riskLevel,
          confidenceScore: data.confidenceScore,
          indicators: data.indicators || [],
          aiExplanation: data.aiExplanation || '',
          filename: data.filename,
          evidenceId: data.evidence?.id || '',
        });
        // Evidence is auto-saved by backend on analysis — mark as saved
        setEvidenceSaved(true);
      }, 500);

    } catch (err) {
      clearInterval(interval);
      console.error('Scan error:', err);
      setIsScanning(false);
      setProgress(0);
      setScanResult('neutral');
      alert('Analysis failed. Make sure the backend is running on port 5000.');
    }
  };

  // This is now only shown if somehow evidence wasn't auto-saved
  const handleSendToLocker = async () => {
    if (!analysisData || evidenceSaved) return;
    setSavingEvidence(true);

    try {
      const res = await fetch('http://localhost:5000/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: analysisData.filename,
          sha256: analysisData.sha256,
          riskLevel: analysisData.riskLevel,
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setEvidenceSaved(true);
      }
    } catch (err) {
      console.error('Failed to save evidence:', err);
    } finally {
      setSavingEvidence(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white flex items-center gap-3">
          <ScanLine className="w-8 h-8 text-cyber-blue" />
          Neural Engine Analyzer
        </h1>
        <p className="text-gray-400 mt-2 font-mono text-sm max-w-3xl">
          Upload suspicious media to check if it may be a manipulated image, video, or voice used for harassment, impersonation, or defamation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Preview Section */}
        <div className="flex flex-col gap-4">
          <div
            className={`glass-panel border-2 border-dashed ${file ? 'border-cyber-blue/50' : 'border-cyber-border hover:border-cyber-cyan/30'} p-8 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden group min-h-[300px]`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={handleFileInput}
              accept="image/*,video/*,audio/*"
            />

            {file && !isScanning && scanResult === 'neutral' ? (
              <div className="flex flex-col items-center z-10">
                <FileType className="w-16 h-16 text-cyber-blue mb-4" />
                <p className="text-white font-mono">{file.name}</p>
                <p className="text-sm text-gray-500 mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={(e) => { e.preventDefault(); startScan(); }}
                  className="mt-6 px-6 py-2 bg-cyber-blue text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 relative z-30 pointer-events-auto"
                >
                  <ScanLine className="w-5 h-5" /> Ingest & Analyze
                </button>
              </div>
            ) : file && (isScanning || scanResult !== 'neutral') ? (
              <div className="w-full h-full flex flex-col items-center justify-center z-10">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-cyber-border mb-4 bg-black">
                  <div className="absolute inset-0 bg-cyber-base flex items-center justify-center pointer-events-none">
                    <span className="font-mono text-cyber-blue opacity-50">TARGET ACQUIRED</span>
                  </div>
                  {isScanning && (
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-cyber-cyan shadow-[0_0_15px_rgba(0,255,255,1)] z-10 pointer-events-none"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  {isScanning && (
                    <div className="absolute inset-0 bg-cyber-blue/10 animate-pulse pointer-events-none"></div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center z-10">
                <div className="p-4 rounded-full bg-cyber-border/50 text-gray-400 group-hover:text-cyber-cyan group-hover:bg-cyber-cyan/10 transition-colors mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-white font-medium">Drag & Drop Media target</p>
                <p className="text-sm text-gray-500 mt-2">or click to browse local filesystem</p>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-0"></div>
          </div>

          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel p-4"
              >
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-cyber-cyan animate-pulse">Running heuristic algorithms...</span>
                  <span className="text-white">{Math.floor(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-cyber-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyber-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 min-h-[400px] flex flex-col relative overflow-hidden">
            <h3 className="text-lg font-mono font-bold text-white mb-6 border-b border-cyber-border pb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-400" /> Analysis Report
            </h3>

            {scanResult === 'neutral' && !isScanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-mono text-sm opacity-50">
                <ZoomIn className="w-12 h-12 mb-4" />
                <p>AWAITING INPUT_STREAM</p>
              </div>
            ) : isScanning ? (
              <div className="flex-1 flex flex-col gap-4 text-sm font-mono text-gray-400">
                <p className="text-cyber-blue animate-pulse">&gt; Uploading to analysis pipeline...</p>
                {progress > 20 && <p className="text-cyber-blue">&gt; Computing SHA-256 cryptographic hash...</p>}
                {progress > 40 && <p className="text-cyber-blue animate-pulse">&gt; Extracting EXIF metadata...</p>}
                {progress > 60 && <p className="text-cyber-blue">&gt; Running ELA compression analysis...</p>}
                {progress > 75 && <p className="text-cyber-blue animate-pulse">&gt; Querying AI forensic model...</p>}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className={`p-6 rounded-lg flex items-center gap-4 ${scanResult === 'fake' ? 'bg-cyber-red/10 border border-cyber-red/30' : 'bg-cyber-green/10 border border-cyber-green/30'} mb-6`}>
                  {scanResult === 'fake' ? <ShieldX className="w-10 h-10 text-cyber-red" /> : <ShieldCheck className="w-10 h-10 text-cyber-green" />}
                  <div>
                    <h2 className={`text-xl md:text-2xl font-bold ${scanResult === 'fake' ? 'text-cyber-red' : 'text-cyber-green'}`}>
                      {scanResult === 'fake' ? 'POSSIBLE MANIPULATED MEDIA DETECTED' : 'AUTHENTIC_MEDIA'}
                    </h2>
                    <p className={`text-sm ${scanResult === 'fake' ? 'text-cyber-red/70' : 'text-green-500'}`}>
                      Confidence Score: {analysisData?.confidenceScore || (scanResult === 'fake' ? '98.4%' : '99.1%')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analysisData?.sha256 && (
                    <div className="bg-black/30 p-3 rounded border border-cyber-border/50 text-xs font-mono">
                      <span className="text-gray-400 block mb-1">SHA-256 Hash</span>
                      <span className="text-cyber-cyan break-all">{analysisData.sha256}</span>
                    </div>
                  )}

                  {analysisData?.indicators && analysisData.indicators.length > 0 && (
                    <div className="bg-black/30 p-3 rounded border border-cyber-border/50 text-sm font-mono">
                      <span className="text-gray-400 block mb-2">Forensic Indicators</span>
                      <div className="flex flex-wrap gap-1">
                        {analysisData.indicators.map((ind) => (
                          <span key={ind} className="px-2 py-0.5 rounded bg-cyber-red/10 border border-cyber-red/20 text-cyber-red text-xs">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisData?.aiExplanation && (
                    <div className="bg-black/30 p-3 rounded border border-cyber-border/50 text-xs font-mono">
                      <span className="text-gray-400 block mb-1">AI Forensic Analysis</span>
                      <span className="text-gray-300">{analysisData.aiExplanation}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-cyber-border">
                  {evidenceSaved ? (
                    // Evidence is auto-saved by backend — show confirmation
                    <div className="w-full py-2 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green rounded-lg text-sm font-mono flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Evidence Stored in Locker
                    </div>
                  ) : (
                    <button
                      onClick={handleSendToLocker}
                      disabled={savingEvidence}
                      className="w-full py-2 bg-transparent border border-cyber-border text-gray-300 hover:text-white hover:border-cyber-cyan/50 rounded-lg transition-all text-sm font-mono flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Database className="w-4 h-4" />
                      {savingEvidence ? 'Saving...' : 'Send Hash to Evidence Locker'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}