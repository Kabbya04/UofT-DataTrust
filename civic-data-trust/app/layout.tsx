// layout.tsx - Next.js Font Optimization Approach
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { JetBrains_Mono, Fira_Code, Source_Code_Pro } from 'next/font/google';

// Choose one of these popular monospace fonts:

// Option 1: JetBrains Mono (Most popular, great readability)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

// Option 2: Fira Code (Great for coding, has ligatures)
// const firaCode = Fira_Code({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700'],
//   variable: '--font-mono',
//   display: 'swap',
// });

// Option 3: Source Code Pro (Clean, Adobe font)
// const sourceCodePro = Source_Code_Pro({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700'],
//   variable: '--font-mono',
//   display: 'swap',
// });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={jetbrainsMono.variable} // Change this to firaCode.variable or sourceCodePro.variable if preferred
    >
      <body className={jetbrainsMono.className}> {/* This applies monospace to entire body */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="w-full min-h-screen overflow-hidden">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}