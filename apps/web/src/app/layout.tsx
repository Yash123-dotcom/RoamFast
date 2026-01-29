import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';
import Providers from '@/components/shared/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/shared/SmoothScroll';
import LaunchBanner from '@/components/features/home/LaunchBanner';
import FloatingHotelCTA from '@/components/ui/FloatingHotelCTA';

const heading = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['200', '400', '500', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'RoamFast | Verified Luxury Stays for Time-Conscious Travelers',
  description: 'Every stay is personally vetted for quality and trust. Experience curated luxury accommodations that save you time and deliver unforgettable moments.',
  icons: {
    icon: '/logo-roamfast.png',
    shortcut: '/favicon.ico',
    apple: '/logo-roamfast.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${heading.variable} ${body.variable} dark`}>
      <body className="antialiased bg-black text-white selection:bg-amber-500/30">
        <Providers>
          <SmoothScroll>
            <Navbar />
            <LaunchBanner />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <FloatingHotelCTA />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}