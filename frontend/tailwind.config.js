/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        electric: {
          400: '#38bdf8',
          500: '#3b82f6',
          600: '#2563eb',
          cyan: '#00f0ff',
        },
        coral: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          neon: '#ff4757',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-coral': 'glowCoral 2s infinite alternate',
      },
      keyframes: {
        glowCoral: {
          '0%': { boxShadow: '0 0 5px rgba(255, 71, 87, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 71, 87, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
