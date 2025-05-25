import { Metadata } from 'next';
import MainLayout from '@/components/ui/MainLayout';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About - Lawn Care Directory',
  description: 'Learn more about the Lawn Care Directory and my mission to connect homeowners with professional lawn care providers.',
};

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="bg-primary-800 py-16 px-4 sm:px-6 lg:px-8 mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">About</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-primary-100">
              Connecting homeowners with trusted lawn care professionals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              I created Lawn Care Directory to solve a problem I experienced firsthand: finding reliable,
              professional lawn care services shouldn't be so difficult. My goal is to build a platform that
              makes this process simple for homeowners while helping quality lawn care professionals gain the
              visibility they deserve.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Story Behind the Directory</h2>
            <p className="text-lg text-gray-600 mb-6">
              After struggling to find a dependable lawn service for my own home in 2023, I realized there was
              no centralized resource that focused exclusively on lawn care. As a web developer with a passion 
              for solving real problems, I set out to build this directory from scratch. What started as a 
              personal project has grown into a platform that's helping homeowners and lawn care professionals
              connect across the country.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Makes This Directory Different</h2>
            <p className="text-lg text-gray-600">
              Unlike giant service platforms that try to cover everything, Lawn Care Directory focuses exclusively
              on lawn care and landscaping. This specialization allows me to create features specifically for this
              industry and build relationships with quality providers. I personally review submissions to maintain
              high standards, and I'm constantly improving the platform based on feedback from both homeowners and
              lawn care professionals.
            </p>
          </div>
          
          <div className="mt-10 lg:mt-0">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-80 w-full">
                <Image 
                  src="https://images.pexels.com/photos/5997996/pexels-photo-5997996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Lawn care professional mowing a lawn"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary-600">500+</div>
                <p className="mt-2 text-sm text-gray-600">Verified providers</p>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary-600">2,000+</div>
                <p className="mt-2 text-sm text-gray-600">Homeowner searches monthly</p>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary-600">30+</div>
                <p className="mt-2 text-sm text-gray-600">Cities and growing</p>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary-600">4.7/5</div>
                <p className="mt-2 text-sm text-gray-600">Average provider rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 