/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        backlog: '#6b7280',
        linedup: '#3b82f6',
        wip: '#f59e0b',
        done: '#10b981',
        stuck: '#ef4444',
      }
    },
  },
  plugins: [],
}
