import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'
import Link from 'next/link'
import { LocationProvider } from '@/contexts/LocationContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'LawnFinder - Find Top-Rated Lawn Care Professionals',
  description: 'Connect with trusted lawn care experts in your area. Compare services, read reviews, and request quotes from professional lawn care providers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`h-full ${inter.variable} ${montserrat.variable}`}>
        <LocationProvider>
          <Header />
          <div className="pt-16">
            {children}
          </div>
          <Footer />
        </LocationProvider>
      </body>
    </html>
  )
} 