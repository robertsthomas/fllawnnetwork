import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import { PostHogProvider } from '~/components/PostHogProvider';
import { QueryProvider } from '~/components/QueryProvider';
import { LocationProvider } from '~/contexts/LocationContext';
import { ConvexClientProvider } from '~/providers';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Top Lawn Care in Florida | FL Lawn Network',
  description:
    'Find local lawn care and landscaping pros near you. Read reviews, compare quotes, and book expert service.',
  keywords:
    'lawn care services, lawn maintenance, landscaping services, garden services, lawn mowing, professional lawn care, local lawn services, lawn care near me, landscaping near me, garden maintenance, lawn service providers, lawn care professionals, residential lawn care, commercial lawn care, lawn care company, lawn service company',
  authors: [{ name: 'Florida Lawn Network' }],
  creator: 'Florida Lawn Network',
  publisher: 'Florida Lawn Network',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.fllawnnetwork.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Top Lawn Care in Florida | FL Lawn Network',
    description:
      'Find local lawn care and landscaping pros near you. Read reviews, compare quotes, and book expert service.',
    url: 'https://www.fllawnnetwork.com',
    siteName: 'Florida Lawn Network',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.fllawnnetwork.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional Lawn Care Services and Landscaping Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Lawn Care in Florida | FL Lawn Network',
    description:
      'Find local lawn care and landscaping pros near you. Read reviews, compare quotes, and book expert service.',
    images: ['https://www.fllawnnetwork.com/twitter-image.jpg'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N9MVPDTD');
          `}
        </Script>
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="oL/tnPHTlzGLF4rJZYhQlw" async />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8923397311432151" crossOrigin="anonymous" />
      </head>
      <body className={`h-full ${inter.variable} ${montserrat.variable}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            title="Google Tag Manager"
            src="https://www.googletagmanager.com/ns.html?id=GTM-N9MVPDTD"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ConvexClientProvider>
          <PostHogProvider>
            <QueryProvider>
              <LocationProvider>
                <Header />
                <div className="pt-16">{children}</div>
                <SpeedInsights />
                <Footer />
              </LocationProvider>
            </QueryProvider>
          </PostHogProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
