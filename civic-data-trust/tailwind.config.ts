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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        'civic-gray': {
          100: '#F1F1F1', // Background - Light theme
          200: '#E6E6E6', // Border - Light theme
          300: '#D9D9D9', // Light gray - Light theme
          400: '#808080', // Medium gray - Universal
          500: '#595959', // Dark gray text - Universal
          900: '#1A1A1A', // Primary text - Light theme
          // Dark theme variants
          'dark': {
            100: '#111419', // Background equivalent for dark
            200: '#252D38', // Border equivalent for dark
            300: '#1F252E', // Light gray equivalent for dark
            400: '#8B949E', // Medium gray for dark theme
            500: '#B8BCC8', // Dark gray text for dark theme
            900: '#F0F2F5', // Primary text for dark theme
          }
        },
        'civic-accent': {
          green: '#43CD41',
          // Dark theme green variant
          'green-dark': '#26A653',
        },
        // Button-specific colors from Figma with dark variants
        'button': {
          primary: '#333333',
          'primary-dark': '#3399FF',
          secondary: '#808080',
          'secondary-dark': '#B8BCC8',
          success: '#43CD41',
          'success-dark': '#26A653',
          danger: '#EF4444',
          'danger-dark': '#CC4125',
          warning: '#F59E0B',
          'warning-dark': '#FF8533',
        },
        // Custom blue color for selected states and buttons
        'brand': {
          blue: '#2196F3',
        },
        // Custom orange color for warning buttons
        'custom': {
          orange: '#DE9300',
        },
        // Custom border color
        'custom-border': {
          DEFAULT: '#A89B9B',
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