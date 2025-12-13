/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background
        bg: {
          primary: '#FAFAF8',
          secondary: '#F5F4F0',
          tertiary: '#ECEAE4',
          elevated: '#FFFFFF',
        },
        // Brand - Sage
        sage: {
          50: '#E8F0EB',
          100: '#D1E1D7',
          200: '#A8C5B5',
          300: '#7FAA93',
          400: '#5D8A72',
          500: '#4A7360',
          600: '#3A5C4D',
          700: '#2A453A',
          DEFAULT: '#5D8A72',
        },
        // Text
        text: {
          primary: '#2C2C2C',
          secondary: '#5C5C5C',
          muted: '#8C8C8C',
        },
        // Alert
        alert: {
          red: '#D9534F',
          'red-light': '#FAEDEC',
          yellow: '#D4A03C',
          'yellow-light': '#FDF6E8',
        },
        // Border
        border: {
          DEFAULT: '#E5E3DD',
          light: '#F0EEE9',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['M PLUS Rounded 1c', 'DM Sans', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 24px rgba(93, 138, 114, 0.1)',
      },
    },
  },
  plugins: [],
}
