import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ScanLine, ShieldCheck, FileType, ZoomIn, ShieldX, Database, ShieldAlert } from 'lucide-react';

interface AnalysisResponse {
  filename: string;
  sha256: string;
  riskLevel: string;
  confidenceScore: string;
  indicators: string[];
  aiExplanation: string;
}

export default function DigitalManipulationRiskAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'neutral' | 'fake' | 'real' | 'warning'>('neutral');
  const [progress, setProgress] = useState(0);
  const [analysisResponse, setAnalysisResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSavedEvidence, setHasSavedEvidence] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      resetState();
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      resetState();
      setFile(e.target.files[0]);
    }
  };

  const resetState = () => {
    setIsScanning(false);
    setScanResult('neutral');
    setProgress(0);
    setAnalysisResponse(null);
    setError(null);
    setHasSavedEvidence(false);
  };

  useEffect(() => {
    if (file && !isScanning && scanResult === 'neutral' && !analysisResponse) {
      startScan();
    }
  }, [file]);

  const startScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setProgress(10);
    setError(null);
    setAnalysisResponse(null);
    
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 500);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        let errorMsg = `Upload failed: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
          if (errData.details) errorMsg += ` - ${errData.details}`;
        } catch (e) {
          // Fallback if not JSON
        }
        throw new Error(errorMsg);
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResponse(data);
      
      setTimeout(() => {
        setIsScanning(false);
        setScanResult(data.riskLevel === 'HIGH' ? 'fake' : data.riskLevel === 'MEDIUM' ? 'warning' : 'real');
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Analysis failed. Please try again.");
      setIsScanning(false);
      setScanResult('neutral');
    }
  };

  const saveToEvidence = async () => {
    if (!analysisResponse) return;
    
    try {
      const response = await fetch("http://localhost:5000/api/evidence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: analysisResponse.filename,
          sha256: analysisResponse.sha256,
          riskLevel: analysisResponse.riskLevel,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save evidence");
      }

      setHasSavedEvidence(true);
    } catch (err) {
      console.error(err);
      setError("ERROR: Failed to save to evidence locker.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white flex items-center gap-3">
          <ScanLine className="w-8 h-8 text-cyber-blue" />
          Digital Manipulation Risk Analysis
        </h1>
        <p className="text-gray-400 mt-2 font-mono text-sm max-w-3xl">Upload suspicious media to check if it may be a manipulated image, video, or voice used for harassment, impersonation, or defamation.</p>
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
                  {/* Mock preview generic image */}
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
                  <span className="text-cyber-cyan animate-pulse">Running neural deepfake detection...</span>
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

            {error ? (
              <div className="flex-1 flex flex-col items-center justify-center text-cyber-red font-mono text-sm opacity-90">
                <ShieldX className="w-12 h-12 mb-4" />
                <p>ERROR: {error}</p>
              </div>
            ) : scanResult === 'neutral' && !isScanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-mono text-sm opacity-50">
                <ZoomIn className="w-12 h-12 mb-4" />
                <p>AWAITING INPUT_STREAM</p>
              </div>
            ) : isScanning ? (
              <div className="flex-1 flex flex-col gap-4 text-sm font-mono text-gray-400">
                <p className="text-cyber-blue animate-pulse">&gt; Extracting metadata...</p>
                {progress > 20 && <p className="text-cyber-blue">&gt; Hash collision check: clean</p>}
                {progress > 50 && <p className="text-cyber-blue animate-pulse">&gt; Analyzing via DeepShield Neural Engine...</p>}
                {progress > 80 && <p className="text-cyber-blue">&gt; Finalizing risk level assessment...</p>}
              </div>
            ) : analysisResponse ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className={`p-6 rounded-lg flex items-center gap-4 ${scanResult === 'fake' ? 'bg-cyber-red/10 border border-cyber-red/30' : scanResult === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-cyber-green/10 border border-cyber-green/30'} mb-6`}>
                  {scanResult === 'fake' ? <ShieldX className="w-10 h-10 text-cyber-red" /> : scanResult === 'warning' ? <ShieldAlert className="w-10 h-10 text-yellow-500" /> : <ShieldCheck className="w-10 h-10 text-cyber-green" />}
                  <div>
                    <h2 className={`text-xl md:text-2xl font-bold ${scanResult === 'fake' ? 'text-cyber-red' : scanResult === 'warning' ? 'text-yellow-500' : 'text-cyber-green'}`}>
                      {scanResult === 'fake' ? 'Potential Manipulation Detected' : scanResult === 'warning' ? 'Suspicious Indicators Found' : 'Media appears authentic'}
                    </h2>
                    <p className={`text-sm ${scanResult === 'fake' ? 'text-cyber-red/70' : scanResult === 'warning' ? 'text-yellow-500/70' : 'text-green-500'}`}>Status: AI analysis completed</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black/30 p-3 rounded border border-cyber-border/50 text-sm font-mono">
                    <span className="text-gray-400">Filename</span>
                    <span className="text-cyber-blue truncate max-w-xs">{analysisResponse.filename}</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/30 p-3 rounded border border-cyber-border/50 text-sm font-mono">
                    <span className="text-gray-400">SHA256 Hash</span>
                    <span className="text-cyber-blue truncate max-w-[200px] sm:max-w-xs" title={analysisResponse.sha256}>
                      {analysisResponse.sha256}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-black/30 p-3 rounded border border-cyber-border/50 text-sm font-mono">
                    <span className="text-gray-400">Risk Level</span>
                    <span className={scanResult === 'fake' ? 'text-cyber-red font-bold' : scanResult === 'warning' ? 'text-yellow-500 font-bold' : 'text-cyber-green font-bold'}>
                      {analysisResponse.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-black/30 p-3 rounded border border-cyber-border/50 text-sm font-mono">
                    <span className="text-gray-400">Confidence Score</span>
                    <span className="text-cyber-blue font-bold">
                      {analysisResponse.confidenceScore}
                    </span>
                  </div>
                  <div className="flex flex-col bg-black/30 p-3 rounded border border-cyber-border/50 text-sm font-mono gap-1">
                    <span className="text-gray-400 mb-1">Forensic Indicators</span>
                    {analysisResponse.indicators && analysisResponse.indicators.length > 0 ? (
                      <ul className="list-disc pl-5 text-cyber-cyan text-xs">
                        {analysisResponse.indicators.map((indicator, idx) => (
                          <li key={idx}>{indicator}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 text-xs italic">No anomaly artifacts detected</span>
                    )}
                  </div>
                  <div className="flex flex-col bg-black/30 p-3 rounded border border-cyber-border/50 text-sm font-mono">
                    <span className="text-gray-400 mb-2">AI Analysis Explanation</span>
                    <span className="text-gray-300 text-xs">
                      {analysisResponse.aiExplanation}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-cyber-border">
                  <button 
                    onClick={saveToEvidence}
                    disabled={hasSavedEvidence}
                    className={`w-full py-2 bg-transparent border ${hasSavedEvidence ? 'border-cyber-green text-cyber-green/50 cursor-not-allowed' : 'border-cyber-border text-gray-300 hover:text-white hover:border-cyber-cyan/50'} rounded-lg transition-all text-sm font-mono flex items-center justify-center gap-2`}
                  >
                    {hasSavedEvidence ? (
                      <>
                        <ShieldCheck className="w-4 h-4" /> Evidence stored securely.
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" /> Send Hash to Evidence Locker
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
