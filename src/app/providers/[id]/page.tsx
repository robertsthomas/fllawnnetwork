import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/ui/MainLayout';
import { getProviderById } from '@/lib/strapi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Sample gallery images
const galleryImages = [
  "https://images.pexels.com/photos/589/garden-grass-lawn-meadow.jpg",
  "https://images.pexels.com/photos/8031946/pexels-photo-8031946.jpeg",
  "https://images.pexels.com/photos/4592317/pexels-photo-4592317.jpeg",
  "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg",
  "https://images.pexels.com/photos/2261/garden-green-trees-park.jpg",
  "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg"
];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  try {
    const provider = await getProviderById(id);
    
    return {
      title: `${provider.title} - Professional Lawn Care Services | FLLawnNetwork`,
      description: provider.description?.substring(0, 160) || 'View details and contact information for this lawn care provider.',
    };
  } catch (error) {
    return {
      title: 'Provider Not Found - Lawn Care Directory',
      description: 'Sorry, this provider could not be found.',
    };
  }
}

export default async function ProviderDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  let provider;
  
  try {
    provider = await getProviderById(id);
    
    if (!provider) {
      notFound();
    }
  } catch (error) {
    notFound();
  }
  
  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <Image 
            src={provider.featuredImageUrl || 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg'}
            alt={`${provider.title} showcase`}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/60 mix-blend-multiply"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-8">
            <Image 
              src={provider.logo || provider.featuredImageUrl || 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg'}
              alt={`${provider.title} logo`}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" 
            />
            <div className="mt-6 md:mt-0">
              <div className="flex flex-wrap gap-3">
                {provider.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-500 text-white">
                    Featured Provider
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Verified
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {provider.reviews.count}+ Reviews
                </span>
              </div>
              
              <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                {provider.title}
              </h1>
              
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 ${i < provider.reviews.stars ? 'text-accent-400' : 'text-gray-400'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xl text-white font-semibold">{provider.reviews.stars}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{provider.address.city}, {provider.address.state}</span>
              </div>
              
              <p className="mt-4 text-xl text-gray-300 max-w-3xl">
                {provider.description}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Link 
                  href={`/contact?provider=${provider.documentId}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition transform hover:scale-105"
                >
                  Get a Quote
                </Link>
                <a 
                  href={`tel:${provider.phone}`}
                  className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Services Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {provider.categories.map((category: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">{
                        category.toLowerCase().includes('mowing') ? '🌿' :
                        category.toLowerCase().includes('design') ? '🎨' :
                        category.toLowerCase().includes('tree') ? '🌳' :
                        category.toLowerCase().includes('irrigation') ? '💧' :
                        category.toLowerCase().includes('fertilization') ? '🌱' :
                        '🏡'
                      }</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                      <p className="mt-1 text-sm text-gray-600">Professional {category.toLowerCase()} services tailored to your needs</p>
                      <Link 
                        href={`/contact?provider=${provider.documentId}&service=${category.toLowerCase().replace(' ', '-')}`}
                        className="mt-2 text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
                      >
                        Get a quote
                        <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium">View All</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative aspect-square group overflow-hidden rounded-lg">
                    <Image 
                      src={image} 
                      alt="Project showcase" 
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm font-medium">View Project</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium">Write a Review</button>
              </div>

              <div className="mb-8 p-6 bg-primary-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-gray-900">{provider.reviews.stars}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < provider.reviews.stars ? 'text-accent-500' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Based on {provider.reviews.count} reviews</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            {/* Contact Form */}
            <div id="contact-form" className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request a Quote</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <Input type="text" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <Input type="tel" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Needed</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {provider.categories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <Textarea rows={4} />
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white rounded-md px-4 py-2 hover:bg-primary-700 transition">
                  Send Request
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Quick Contact</h4>
                <div className="space-y-3">
                  <a href={`tel:${provider.phone}`} className="flex items-center text-gray-600 hover:text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {provider.phone}
                  </a>
                  {provider.email && (
                    <a href={`mailto:${provider.email}`} className="flex items-center text-gray-600 hover:text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {provider.email}
                    </a>
                  )}
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {provider.address.city}, {provider.address.state}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Business Hours</h4>
                <div className="space-y-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-600">{day}</span>
                      <span className="text-gray-900">
                        {provider.availability?.includes(day) ? '8:00 AM - 5:00 PM' : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 