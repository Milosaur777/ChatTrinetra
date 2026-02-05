/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CaptainClaw Custom Palette
        'cc-dark': '#0F1419',
        'cc-darker': '#0A0D12',
        'cc-card': '#1A1F2E',
        'cc-card-light': '#252C3D',
        'cc-mint': '#A8E6CF',
        'cc-pink': '#FFB6D9',
        'cc-blue': '#A8D8EA',
        'cc-orange': '#FFD4A8',
        'cc-text': '#E8E8E8',
        'cc-text-muted': '#B0B0B0',
      },
      backdropBlur: {
        'glass': '10px',
      },
      backgroundColor: {
        'glass': 'rgba(26, 31, 46, 0.6)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
