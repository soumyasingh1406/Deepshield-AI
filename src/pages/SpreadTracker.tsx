import { BarChart3, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PLATFORMS = [
  { platform: 'Instagram', color: '#f59e0b' },
  { platform: 'Telegram', color: '#00f0ff' },
  { platform: 'Twitter/X', color: '#0066ff' },
  { platform: 'Reddit', color: '#ff003c' },
  { platform: 'Messaging Apps', color: '#00ff9d' }
];

const initialValues: Record<string, number> = {
  'Instagram': 40,
  'Telegram': 25,
  'Twitter/X': 18,
  'Reddit': 10,
  'Messaging Apps': 7
};

export default function SpreadTracker() {
  const [spreadData, setSpreadData] = useState(
    PLATFORMS.map(p => ({ ...p, value: initialValues[p.platform] }))
  );
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [spikeAlert, setSpikeAlert] = useState<string | null>(null);
  const prevDataRef = useRef(spreadData);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("spreadUpdate", (data: Record<string, number>) => {
      setSpreadData(prev => {
        const updated = prev.map(item => ({
          ...item,
          value: data[item.platform] !== undefined ? Math.round(data[item.platform]) : item.value
        }));

        // Detect spike — if any platform jumped more than 10% since last update
        for (const item of updated) {
          const old = prevDataRef.current.find(p => p.platform === item.platform);
          if (old && item.value - old.value > 10) {
            setSpikeAlert(`⚠ Viral spike detected on ${item.platform}`);
            setTimeout(() => setSpikeAlert(null), 5000);
          }
        }

        prevDataRef.current = updated;
        return updated;
      });
      setLastUpdate(new Date());
    });

    return () => { socket.disconnect(); };
  }, []);

  const totalSpread = spreadData.reduce((sum, d) => sum + d.value, 0);
  const topPlatform = spreadData.reduce((a, b) => a.value > b.value ? a : b);

  const chartData = {
    labels: spreadData.map(d => d.platform),
    datasets: [{
      label: 'Spread %',
      data: spreadData.map(d => d.value),
      backgroundColor: spreadData.map(d => d.color + 'cc'),
      borderColor: spreadData.map(d => d.color),
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleColor: '#fff',
        bodyColor: '#00f0ff',
        borderColor: 'rgba(0,240,255,0.3)',
        borderWidth: 1,
        padding: 10,
        bodyFont: { family: 'monospace' },
        titleFont: { family: 'monospace' },
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw}% spread index`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(0,240,255,0.08)' },
        ticks: {
          color: '#9ca3af',
          font: { family: 'monospace' },
          callback: (v: any) => v + '%'
        },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { family: 'monospace' } },
        border: { display: true, color: 'rgba(0,240,255,0.2)' }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-cyber-blue" />
          Deepfake Media Spread Tracker
        </h1>
        <p className="text-gray-400 font-mono text-sm max-w-2xl">
          Real-time visualization monitoring how manipulated media targeting women spreads across social platforms.
        </p>
        <p className="text-cyber-cyan/80 mt-1 font-mono text-sm italic">
          Mitigate rapid dissemination to minimize harm.
        </p>
      </div>

      {/* Spike Alert */}
      {spikeAlert && (
        <div className="flex items-center gap-3 px-4 py-3 bg-cyber-red/10 border border-cyber-red/40 rounded-lg text-cyber-red font-mono text-sm animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {spikeAlert}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1">
            <Activity className="w-3 h-3" /> TOTAL SPREAD INDEX
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalSpread}<span className="text-sm text-gray-400 ml-1">pts</span></div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1">
            <TrendingUp className="w-3 h-3" /> TOP PLATFORM
          </div>
          <div className="text-2xl font-bold font-mono" style={{ color: topPlatform.color }}>
            {topPlatform.platform}
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1">
            <Activity className="w-3 h-3" /> LAST UPDATE
          </div>
          <div className="text-sm font-mono text-cyber-cyan">
            {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="text-xs text-gray-500 font-mono">Live • every 3s</div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Platform Spread Index</h2>
          <span className="flex items-center gap-1.5 text-xs font-mono text-cyber-green">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse inline-block" />
            LIVE
          </span>
        </div>
        <div className="h-80 w-full">
          <Bar data={chartData} options={chartOptions as any} />
        </div>
      </div>
    </div>
  );
}