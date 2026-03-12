/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          base: '#0A0A0B',
          panel: '#111216',
          border: '#1E2330',
          blue: '#00F0FF',
          darkBlue: '#0066FF',
          cyan: '#00FFFF',
          green: '#00FF66',
          red: '#FF003C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      animation: {
        'scan': 'scan 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 5px rgba(0, 240, 255, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}
