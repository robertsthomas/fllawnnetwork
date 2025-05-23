import { Metadata } from 'next';
import DirectoryContent from '@/components/DirectoryContent';
import MainLayout from '@/components/ui/MainLayout';
import { getProviders } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Lawn Care Directory - Find Local Lawn Care Services',
  description: 'Browse our comprehensive directory of lawn care professionals. Filter by service, read reviews, and connect with the perfect provider for your needs.',
};

export default async function DirectoryPage() {
  const providers = await getProviders();
  console.log("providers", providers);
  
  return (
    <MainLayout>
      <DirectoryContent initialProviders={providers} />
    </MainLayout>
  );
} 