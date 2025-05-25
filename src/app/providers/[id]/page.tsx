import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/ui/MainLayout';
import { getProviderById } from '@/lib/strapi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Provider } from '@/types';

// Interface for Strapi provider response which might contain nested data
interface ProviderResponse extends Provider {
  data?: {
    attributes?: Provider;
    [key: string]: any;
  };
}

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
    const providerResponse = await getProviderById(id) as ProviderResponse;
    
    let provider: Provider;
    
    // Extract the provider data from the response if it's wrapped in a data object
    if (providerResponse.data && !providerResponse.title) {
      provider = providerResponse.data.attributes || providerResponse.data as Provider;
    } else {
      provider = providerResponse as Provider;
    }
    
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

export default async function ProviderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  let provider: Provider;
  
  try {
    const providerResponse = await getProviderById(id) as ProviderResponse;
    
    if (!providerResponse) {
      notFound();
    }

    // Extract the provider data from the response if it's wrapped in a data object
    if (providerResponse.data && !providerResponse.title) {
      provider = providerResponse.data.attributes || providerResponse.data as Provider;
    } else {
      provider = providerResponse as Provider;
    }
  } catch (error) {
    notFound();
  }

  // Get the featured image or fallback to the first image in the array
  const featuredImage = provider.featuredImageUrl || (provider.imageUrls?.length > 0 ? provider.imageUrls[0] : 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg');
  
  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <Image 
            src={featuredImage}
            alt={`${provider.title || 'Provider'} showcase`}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/60 mix-blend-multiply"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-8">
            <Image 
              src={featuredImage}
              alt={`${provider.title || 'Provider'} logo`}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" 
            />
            <div className="mt-6 md:mt-0">
              <div className="flex flex-wrap gap-3">
                {provider.featured && (
                  <Badge variant="secondary" className="bg-accent-500 text-white hover:bg-accent-600 px-3 py-1 rounded-full">
                    Featured Provider
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-full">
                  Verified
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full">
                  {provider.reviewsCount || 0}+ Reviews
                </Badge>
              </div>
              
              <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                {provider.title || 'Provider'}
              </h1>
              
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 ${i < Math.floor(provider.totalScore || 0) ? 'text-accent-400' : 'text-gray-400'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xl text-white font-semibold">{(provider.totalScore || 0).toFixed(1)}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{provider.address && `${provider.address.city || ''}, ${provider.address.state || ''}`}</span>
              </div>
              
              <p className="mt-4 text-xl text-gray-300 max-w-3xl">
                {provider.description || ''}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Button asChild className="px-6 py-3 shadow-sm transition transform hover:scale-105">
                  <Link href={`/contact?provider=${provider.documentId}`}>
                    Get a Quote
                  </Link>
                </Button>
                {provider.phone && (
                  <Button asChild variant="outline" className="px-6 py-3 border-white text-white hover:bg-white hover:text-gray-900 transition">
                    <a href={`tel:${provider.phone}`}>
                      Call Now
                    </a>
                  </Button>
                )}
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
              <Accordion type="multiple" className="w-full">
                {(provider.categories || []).map((category: string, index: number) => (
                  <AccordionItem key={index} value={`service-${index}`}>
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <span className="text-xl">{
                            category.toLowerCase().includes('mowing') ? '🌿' :
                            category.toLowerCase().includes('design') ? '🎨' :
                            category.toLowerCase().includes('tree') ? '🌳' :
                            category.toLowerCase().includes('irrigation') ? '💧' :
                            category.toLowerCase().includes('fertilization') ? '🌱' :
                            '🏡'
                          }</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-14 pb-2">
                        <p className="text-sm text-gray-600">Professional {category.toLowerCase()} services tailored to your needs</p>
                        <Button asChild variant="link" size="sm" className="mt-2 p-0 h-auto text-primary-600 hover:text-primary-700">
                          <Link href={`/contact?provider=${provider.documentId || ''}&service=${category.toLowerCase().replace(' ', '-')}`}>
                            Get a quote
                            <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Gallery Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
                <Button variant="ghost" className="text-primary-600 hover:text-primary-700 font-medium">View All</Button>
              </div>
              <Carousel className="w-full">
                <CarouselContent>
                  {(provider.imageUrls?.length > 0 ? provider.imageUrls : galleryImages).slice(0, 6).map((image: string, index: number) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <Image 
                          src={image} 
                          alt="Project showcase" 
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white text-sm font-medium">View Project</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </section>

            {/* Reviews Section */}
            <section className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                {provider.reviewsLink && (
                  <Button variant="link" asChild className="text-primary-600 hover:text-primary-700 font-medium">
                    <a href={provider.reviewsLink} target="_blank" rel="noopener noreferrer">
                      Write a Review
                    </a>
                  </Button>
                )}
              </div>

              <Card className="bg-primary-50 border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-gray-900">{(provider.totalScore || 0).toFixed(1)}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 ${i < Math.floor(provider.totalScore || 0) ? 'text-accent-500' : 'text-gray-300'}`} 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Based on {provider.reviewsCount || 0} reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            {/* Contact Form */}
            <Card id="contact-form" className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Request a Quote</CardTitle>
              </CardHeader>
              <CardContent>
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
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {(provider.categories || []).map((category: string, index: number) => (
                          <SelectItem key={index} value={category.toLowerCase()}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <Textarea placeholder="Tell us about your lawn care needs" className="h-24" />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full"
                  >
                    Send Request
                  </Button>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Or contact directly:</p>
                    <div className="flex justify-center space-x-4 mt-2">
                      {provider.phone && (
                        <Button variant="ghost" size="icon" asChild className="text-primary-600 hover:text-primary-700">
                          <a href={`tel:${provider.phone}`}>
                            <span className="sr-only">Phone</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </a>
                        </Button>
                      )}
                      {provider.website && (
                        <Button variant="ghost" size="icon" asChild className="text-primary-600 hover:text-primary-700">
                          <a href={provider.website} target="_blank" rel="noopener noreferrer">
                            <span className="sr-only">Website</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </Button>
                      )}
                      {provider.socials?.facebook && (
                        <Button variant="ghost" size="icon" asChild className="text-primary-600 hover:text-primary-700">
                          <a href={provider.socials.facebook} target="_blank" rel="noopener noreferrer">
                            <span className="sr-only">Facebook</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                          </a>
                        </Button>
                      )}
                      {provider.socials?.instagram && (
                        <Button variant="ghost" size="icon" asChild className="text-primary-600 hover:text-primary-700">
                          <a href={provider.socials.instagram} target="_blank" rel="noopener noreferrer">
                            <span className="sr-only">Instagram</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 