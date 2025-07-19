/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Merriweather', 'serif'],
      },
      colors: {
        // ... (other colors)
        offwhite: '#F5F5F5', // You can adjust this hex code to your preferred shade of off-white
      },
    },
  },
  safelist: [
    'text-offwhite',
  ],
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
