// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'urbanist': ['var(--font-urbanist)', 'Urbanist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-urbanist)', 'Urbanist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'lg': '1rem', // 16px matching Figma
        'xl': '1.5rem', // 24px
        '2xl': '2rem', // 32px
        '3xl': '3rem', // 48px
        '4xl': '3.125rem', // 50px matching search bar
      },
      colors: {
        'civic-gray': {
          100: '#F1F1F1', // Background
          200: '#E6E6E6', // Border
          300: '#D9D9D9', // Light gray
          400: '#808080', // Medium gray
          500: '#595959', // Dark gray text
          900: '#1A1A1A', // Primary text
        },
        'civic-accent': {
          green: '#43CD41',
        },
        // Button-specific colors from Figma
        'button': {
          primary: '#333333',
          secondary: '#808080',
          success: '#43CD41',
          danger: '#EF4444',
          warning: '#F59E0B',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '90': '28.5rem',
      },
      fontSize: {
        'figma-sm': ['0.75rem', { lineHeight: '1.2' }], // 12px
        'figma-base': ['0.875rem', { lineHeight: '1.2' }], // 14px
        'figma-lg': ['1rem', { lineHeight: '1.2' }], // 16px
        'figma-xl': ['1.25rem', { lineHeight: '1.2' }], // 20px
        'figma-2xl': ['1.5rem', { lineHeight: '1.2' }], // 24px
        'figma-3xl': ['2rem', { lineHeight: '1.2' }], // 32px
      },
      boxShadow: {
        'figma': '0px 2px 2px 0px rgba(0, 0, 0, 0.05)',
        'figma-card': '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
