import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'
import Link from 'next/link'
import { LocationProvider } from '@/contexts/LocationContext'
import { PostHogProvider } from '@/components/PostHogProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'FLLawnNetwork - Find Top-Rated Lawn Care Professionals',
  description: 'Connect with trusted lawn care experts in your area. Compare services, read reviews, and request quotes from professional lawn care providers.',
  keywords: 'lawn care, lawn maintenance, landscaping, garden services, lawn mowing, professional lawn care, local lawn services',
  authors: [{ name: 'FLLawnNetwork' }],
  creator: 'FLLawnNetwork',
  publisher: 'FLLawnNetwork',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fllawnnetwork.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'FLLawnNetwork - Find Top-Rated Lawn Care Professionals',
    description: 'Connect with trusted lawn care experts in your area. Compare services, read reviews, and request quotes from professional lawn care providers.',
    url: 'https://fllawnnetwork.com',
    siteName: 'FLLawnNetwork',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FLLawnNetwork - Professional Lawn Care Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLLawnNetwork - Find Top-Rated Lawn Care Professionals',
    description: 'Connect with trusted lawn care experts in your area. Compare services, read reviews, and request quotes from professional lawn care providers.',
    images: ['/twitter-image.jpg'],
    creator: '@fllawnnetwork',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`h-full ${inter.variable} ${montserrat.variable}`}>
        <PostHogProvider>
          <LocationProvider>
            <Header />
            <div className="pt-16">
              {children}
            </div>
            <Footer />
          </LocationProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}