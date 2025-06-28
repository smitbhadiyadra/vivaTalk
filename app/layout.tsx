import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'VivaTalk - AI-Powered Video Conversations',
  description: 'Experience meaningful AI-powered video conversations with industry experts and friendly companions. Your journey to better communication starts here.',
  keywords: 'AI, video chat, conversations, therapy, experts, Groq, Tavus',
  authors: [{ name: 'VivaTalk Team' }],
  openGraph: {
    title: 'VivaTalk - AI-Powered Video Conversations',
    description: 'Experience meaningful AI-powered video conversations with industry experts and friendly companions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VivaTalk - AI-Powered Video Conversations',
    description: 'Experience meaningful AI-powered video conversations with industry experts and friendly companions.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="pt-16">
                {children}
              </main>
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}