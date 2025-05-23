import { Metadata } from 'next';
import MainLayout from '@/components/ui/MainLayout';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us - Lawn Care Directory',
  description: 'Learn more about the Lawn Care Directory and our mission to connect homeowners with professional lawn care providers.',
};

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="bg-primary-800 py-16 px-4 sm:px-6 lg:px-8 mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">About Us</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-primary-100">
              Connecting homeowners with trusted lawn care professionals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              At Lawn Care Directory, our mission is to simplify the process of finding reliable, 
              professional lawn care services for homeowners while helping local lawn care 
              businesses grow by connecting them with customers in their area.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Started</h2>
            <p className="text-lg text-gray-600 mb-6">
              Founded in 2024, Lawn Care Directory was created by a team of landscape professionals 
              and web developers who saw a need for a better way to connect homeowners with quality 
              lawn care services. What started as a small local directory has grown into a nationwide 
              platform trusted by thousands of homeowners.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-lg text-gray-600">
              Unlike other service directories, we focus exclusively on lawn care and landscaping, 
              allowing us to provide a more specialized and valuable platform for both homeowners and providers. 
              We verify all providers in our directory and collect authentic reviews to ensure quality.
            </p>
          </div>
          
          <div className="mt-10 lg:mt-0">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-80 w-full">
                <Image 
                  src="https://images.pexels.com/photos/589/garden-gardening-grass-lawn.jpg" 
                  alt="Lawn care professional mowing a lawn"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary-600">5,000+</div>
                <p className="mt-2 text-sm text-gray-600">Trusted providers nationwide</p>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary-600">25,000+</div>
                <p className="mt-2 text-sm text-gray-600">Happy homeowners</p>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary-600">100+</div>
                <p className="mt-2 text-sm text-gray-600">Cities covered</p>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary-600">4.8/5</div>
                <p className="mt-2 text-sm text-gray-600">Average provider rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 