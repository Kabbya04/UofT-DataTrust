// app/layout.tsx
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.className} ${GeistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}