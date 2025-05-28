import { Suspense } from 'react';
import CTASection from '~/components/CTASection';
import FeaturedProviders from '~/components/FeaturedProviders';
import Hero from '~/components/Hero';
import HowItWorks from '~/components/HowItWorks';
import ServicesList from '~/components/ServicesList';
import Testimonials from '~/components/Testimonials';
import MainLayout from '~/components/ui/MainLayout';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { reviews, services } from '~/data/providers';

function FeaturedProvidersLoadingPlaceholder() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="px-0 text-center">
            <Skeleton className="h-10 w-56 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="px-0">
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-4">
                      <Skeleton className="h-32 w-32 rounded-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex space-x-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Skeleton key={j} className="h-4 w-4" />
                        ))}
                      </div>
                      <Skeleton className="h-10 w-full mt-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <HowItWorks />
      <Suspense fallback={<FeaturedProvidersLoadingPlaceholder />}>
        <FeaturedProviders />
      </Suspense>
      <ServicesList services={services} />
      {/* <Testimonials reviews={reviews} /> */}
      {/* <CTASection /> */}
    </MainLayout>
  );
}
