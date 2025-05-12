/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'card-bg': 'var(--card-bg)',
        'card-text': 'var(--card-text)',
        'card-border': 'var(--card-border)',
        'input-bg': 'var(--input-bg)',
        'input-border': 'var(--input-border)',
        'input-text': 'var(--input-text)',
        'button-bg': 'var(--button-bg)',
        'button-text': 'var(--button-text)',
        'button-hover': 'var(--button-hover)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
      },
    },
  },
  plugins: [],
}
