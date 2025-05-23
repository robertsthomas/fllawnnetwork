import { Metadata } from 'next';
import MainLayout from '@/components/ui/MainLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Services - Lawn Care Directory',
  description: 'Browse our comprehensive list of lawn care services. Find the perfect provider for your needs.',
};

export default function ServicesPage() {
  const services = [
    {
      name: 'Lawn Mowing',
      slug: 'lawn-mowing',
      description: 'Regular cutting and maintenance of grass to keep your lawn looking its best. Our providers offer various cutting patterns and heights to suit your preferences.',
      icon: '🌿'
    },
    {
      name: 'Landscaping',
      slug: 'landscaping',
      description: 'Comprehensive design and implementation of outdoor spaces. From simple garden layouts to complete property transformations.',
      icon: '🏡'
    },
    {
      name: 'Garden Design',
      slug: 'garden-design',
      description: 'Professional planning and creation of beautiful gardens. Our providers can help with plant selection, layout, and ongoing maintenance.',
      icon: '🌷'
    },
    {
      name: 'Irrigation',
      slug: 'irrigation',
      description: 'Installation and maintenance of watering systems to keep your lawn and plants healthy year-round.',
      icon: '💧'
    },
    {
      name: 'Tree Trimming',
      slug: 'tree-trimming',
      description: 'Professional pruning and maintenance of trees to enhance appearance, promote healthy growth, and prevent property damage.',
      icon: '🌳'
    },
    {
      name: 'Pest Control',
      slug: 'pest-control',
      description: 'Effective treatment and prevention measures to protect your lawn and garden from insects and other pests.',
      icon: '🐜'
    },
    {
      name: 'Fertilization',
      slug: 'fertilization',
      description: 'Application of nutrients to promote healthy growth and vibrant color in your lawn and garden.',
      icon: '🌱'
    },
    {
      name: 'Weed Control',
      slug: 'weed-control',
      description: 'Targeted treatments to eliminate unwanted plants and prevent their return.',
      icon: '🌾'
    }
  ];

  return (
    <MainLayout>
      <div className="bg-primary-800 py-16 px-4 sm:px-6 lg:px-8 mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Our Services
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-primary-100">
              Find professionals for all your lawn care and landscaping needs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-md mb-4">
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  href={`/directory?service=${service.slug}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-500"
                >
                  Find providers
                  <svg className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
} 