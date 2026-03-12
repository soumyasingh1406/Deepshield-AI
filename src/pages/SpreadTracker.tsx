import { BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const initialSpreadData = [
  { platform: 'Instagram', value: 40, color: '#f59e0b' },
  { platform: 'Telegram', value: 25, color: '#00f0ff' },
  { platform: 'Twitter/X', value: 18, color: '#0066ff' },
  { platform: 'Reddit', value: 10, color: '#ff003c' },
  { platform: 'Messaging Apps', value: 7, color: '#00ff9d' }
];

export default function SpreadTracker() {
  const [spreadData, setSpreadData] = useState(initialSpreadData);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("spreadUpdate", (data: Record<string, number>) => {
      setSpreadData(prev => prev.map(item => ({
        ...item,
        value: data[item.platform] !== undefined ? Math.round(data[item.platform]) : item.value
      })));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = {
    labels: spreadData.map(d => d.platform),
    datasets: [
      {
        label: 'Spread',
        data: spreadData.map(d => d.value),
        backgroundColor: spreadData.map(d => d.color),
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#00f0ff',
        borderColor: 'rgba(0, 240, 255, 0.3)',
        borderWidth: 1,
        padding: 10,
        bodyFont: {
          family: 'monospace'
        },
        titleFont: {
          family: 'monospace'
        },
        callbacks: {
          label: function(context: any) {
            return `${context.raw}% Spread`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 240, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'monospace'
          },
          callback: function(value: any) {
            return value + '%';
          }
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'monospace'
          }
        },
        border: {
          display: true,
          color: 'rgba(0, 240, 255, 0.2)'
        }
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
        <p className="text-cyber-cyan/80 mt-1 font-mono text-sm max-w-2xl italic">
          Mitigate rapid dissemination to minimize harm.
        </p>
      </div>

      <div className="glass-panel p-6">
        <div className="h-96 w-full mt-4">
          <Bar data={chartData} options={chartOptions as any} />
        </div>
      </div>
    </div>
  );
}
