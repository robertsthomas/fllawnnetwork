import MainLayout from '@/components/ui/MainLayout';
import Hero from '@/components/Hero';
import FeaturedProviders from '@/components/FeaturedProviders';
import HowItWorks from '@/components/HowItWorks';
import ServicesList from '@/components/ServicesList';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import { services, reviews } from '@/data/providers';
import { getProviders } from '@/lib/strapi';

export default async function Home() {
  const providers = await getProviders();

  return (
    <MainLayout>
      <Hero />
      <HowItWorks />
      <FeaturedProviders providers={providers} />
      <ServicesList services={services} />
      {/* <Testimonials reviews={reviews} /> */}
      {/* <CTASection /> */}
    </MainLayout>
  );
} 