import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProviderDetailContent from '~/components/ProviderDetailContent';
import MainLayout from '~/components/ui/MainLayout';
import { Button } from '~/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Helper function to validate if a string is a valid Convex ID
function isValidConvexId(id: string): boolean {
  // Convex IDs typically start with a table prefix followed by an underscore and a base64-like string
  // For providers table, it should start with something like "j" or similar prefix
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length > 10 && !['onboarding', 'dashboard', 'login', 'signup', 'register', 'add'].includes(id);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Check if the ID is a valid Convex ID format
  if (!isValidConvexId(id)) {
    return {
      title: 'Provider Not Found - Lawn Care Directory',
      description: 'The requested provider could not be found.',
    };
  }
  
  try {
    const provider = await convex.query(api.providers.getProviderById, { id: id as Id<'providers'> });
    
    if (!provider) {
      return {
        title: 'Provider Not Found - Lawn Care Directory',
        description: 'The requested provider could not be found.',
      };
    }

    return {
      title: `${provider.title} - Lawn Care Services in ${provider.address?.city || 'Florida'}`,
      description: `${provider.title} provides professional lawn care services in ${provider.address?.city || 'Florida'}. Contact us for a free quote.`,
      alternates: {
        canonical: `/providers/${provider._id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Provider Not Found - Lawn Care Directory',
      description: 'The requested provider could not be found.',
    };
  }
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Check if the ID is a valid Convex ID format
  if (!isValidConvexId(id)) {
    notFound();
  }
  
  try {
    const provider = await convex.query(api.providers.getProviderById, { id: id as Id<'providers'> });

    if (!provider) {
      notFound();
    }

    // Generate LocalBusiness schema
    const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://www.fllawnnetwork.com/providers/${provider._id}`,
    "name": provider.title,
    "description": provider.categories.join(', '),
    "image": provider.featuredImageUrl || provider.imageUrls[0],
    "url": `https://www.fllawnnetwork.com/providers/${provider._id}`,
    "telephone": provider.phone,
    "email": provider.email,
    "address": provider.address ? {
      "@type": "PostalAddress",
      "streetAddress": provider.address.street,
      "addressLocality": provider.address.city,
      "addressRegion": provider.address.state,
      "postalCode": provider.address.postalCode,
      "addressCountry": "US"
    } : undefined,
    "openingHoursSpecification": provider.openingHours.map((hours: string) => {
      const [day, time] = hours.split(': ');
      const [open, close] = time.split(' - ');
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": day,
        "opens": open,
        "closes": close
      };
    }),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": provider.totalScore,
      "reviewCount": provider.reviewsCount
    },
    "sameAs": [
      provider.socials.facebook,
      provider.socials.instagram,
      provider.socials.twitter,
      provider.socials.youtube,
      provider.socials.tiktok
    ].filter(Boolean),
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": provider.address?.city || "Florida"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Lawn Care Services",
      "itemListElement": provider.categories.map((category: string, index: number) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": category
        },
        "position": index + 1
      }))
    }
  };

    return (
      <MainLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <Suspense fallback={<div>Loading provider details...</div>}>
          <ProviderDetailContent id={id as Id<'providers'>} />
        </Suspense>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Owner?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If this is your business, claim your listing to update information, respond to reviews,
              and more.
            </p>
            <Button asChild className="px-6">
              <Link href={`/claim-business/${id}`}>Claim This Business</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    notFound();
  }
}
