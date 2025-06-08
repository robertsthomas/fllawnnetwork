'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import * as z from 'zod';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { useLocation } from '~/contexts/LocationContext';
import { useTracking } from '~/hooks/useTracking';
import { getProviderMainImage, getProviderSocials } from '~/lib/apify';
import { cn, formatPhoneNumber } from '~/lib/utils';
import ServiceAreaMap from './ServiceAreaMap';
import ProviderAIAssistant from './ProviderAIAssistant';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

// Define featured provider IDs
const FEATURED_PLACE_IDS = [
  'ChIJhVYnKvzE2YgR3lmo3jABNLw',
  'ChIJi0Op4CKn2YgRGEq_PI5EgIU',
  'ChIJ33-tZVGh2YgRSiunrdwtLmk',
];

// Sample gallery images
const galleryImages = [
  'https://images.pexels.com/photos/589/garden-grass-lawn-meadow.jpg',
  'https://images.pexels.com/photos/8031946/pexels-photo-8031946.jpeg',
  'https://images.pexels.com/photos/4592317/pexels-photo-4592317.jpeg',
  'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg',
  'https://images.pexels.com/photos/2261/garden-green-trees-park.jpg',
  'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg',
];

interface ProviderDetailContentProps {
  id: Id<'providers'>;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProviderDetailContent({ id }: ProviderDetailContentProps) {
  const { trackProviderProfileClick, trackProviderContact } = useTracking();
  const provider = useQuery(api.providers.getProviderById, { id });
  const { location } = useLocation();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [imageError, setImageError] = useState(false);
  const defaultImage = 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg';
  const [galleryImageErrors, setGalleryImageErrors] = useState<Record<number, boolean>>({});
  const [showAllServices, setShowAllServices] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      setFormStatus('submitting');
      setErrorMessage(null);

      try {
        const response = await fetch('/api/request-quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...value,
            providerId: provider?._id.toString(),
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to send message');
        }

        setFormStatus('success');
        form.reset();
        handleContactClick('form');
      } catch (error) {
        console.error('Error sending form:', error);
        setFormStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    },
  });

  useEffect(() => {
    if (provider) {
      trackProviderProfileClick(
        provider._id.toString(),
        provider.title || 'Unknown Provider',
        'profile_view',
        {
          rating: provider.totalScore,
          reviewCount: provider.reviewsCount,
          categories: provider.categories,
          location: formatAddress(),
          userLocation: location ? `${location.city}, ${location.state}` : undefined,
          interactionType: 'view',
        }
      );
    }
  }, [provider, trackProviderProfileClick, location]);

  if (!provider) {
    return <div>Loading provider details...</div>;
  }

  if (!provider) {
    return notFound();
  }

  // Get the featured image or fallback to the first image in the array
  const featuredImage =
    provider.imageUrls[0] ||
    provider.featuredImageUrl ||
    'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg';

  // Format address
  const formatAddress = () => {
    if (!provider.address.city && !provider.address.state) return '';

    const parts = [];
    if (provider.address.city) parts.push(provider.address.city);
    if (provider.address.state) parts.push(provider.address.state);
    return parts.join(', ');
  };

  // Get social media links
  const socials = getProviderSocials(provider);

  const handleContactClick = (method: string) => {
    if (provider) {
      trackProviderContact(provider._id.toString(), provider.title || 'Unknown Provider', method, {
        rating: provider.totalScore,
        reviewCount: provider.reviewsCount,
        categories: provider.categories,
        location: formatAddress(),
        userLocation: location ? `${location.city}, ${location.state}` : undefined,
      });
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src={imageError ? defaultImage : featuredImage}
            alt={`${provider.title || 'Provider'} showcase`}
            fill
            className="object-cover opacity-40"
            priority
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/60 mix-blend-multiply"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-8">
            <Image
              src={imageError ? defaultImage : featuredImage}
              alt={`${provider.title || 'Provider'} logo`}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              onError={() => setImageError(true)}
            />
            <div className="mt-6 md:mt-0">
              <div className="flex flex-wrap gap-3">
                {FEATURED_PLACE_IDS.includes(provider._id.toString()) && (
                  <Badge
                    variant="secondary"
                    className="bg-accent-500 text-white hover:bg-accent-600 px-3 py-1 rounded-full"
                  >
                    ⭐ Featured Provider
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-full"
                >
                  ✅ Verified Business
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full"
                >
                  🔒 Licensed & Insured
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1 rounded-full"
                >
                  {provider.reviewsCount || 0}+ Reviews
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1 rounded-full"
                >
                  ⚡ Quick Response
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
                      className={`h-6 w-6 ${
                        i < Math.floor(provider.totalScore || 0)
                          ? 'text-accent-400'
                          : 'text-gray-400'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xl text-white font-semibold">
                    {(provider.totalScore || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{formatAddress()}</span>
              </div>

              <p className="mt-4 text-xl text-gray-300 max-w-3xl">
                {`Professional lawn care services by ${provider.title}`}
              </p>

              <div className="mt-6 flex gap-4">
                <Button
                  asChild
                  className={cn(
                    'px-6 py-3 shadow-sm transition hover:bg-green-600 bg-green-500 text-white w-1/2',
                    provider.isClaimed && 'w-full'
                  )}
                  onClick={() => handleContactClick('form')}
                >
                  <Link href={`/contact?provider=${provider._id.toString() || ''}`}>
                    Get a Quote
                  </Link>
                </Button>
                {provider.isClaimed && provider.phone && (
                  <Button
                    asChild
                    variant="outline"
                    className="px-6 py-3 transition bg-white text-black hover:bg-slate-500 hover:text-white w-full"
                    onClick={() => handleContactClick('phone')}
                  >
                    <a href={`tel:${provider.phone}`}>Call Now</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Metrics */}
      {/* <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">500+</div>
              <div className="mt-1 text-sm text-gray-600">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">{provider.reviewsCount || 0}</div>
              <div className="mt-1 text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">15+</div>
              <div className="mt-1 text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">2hrs</div>
              <div className="mt-1 text-sm text-gray-600">Response Time</div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Highlights */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">👨‍👩‍👧‍👦</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Family-Owned Business</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">🌱</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Eco-Friendly Methods</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">⚡</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Fast Response</span>
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {(provider.categories || []).slice(0, showAllServices ? undefined : 3).map((category: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">
                        {category.toLowerCase().includes('mowing')
                          ? '🌿'
                          : category.toLowerCase().includes('design')
                            ? '🎨'
                            : category.toLowerCase().includes('tree')
                              ? '🌳'
                              : category.toLowerCase().includes('irrigation')
                                ? '💧'
                                : category.toLowerCase().includes('fertilization')
                                  ? '🌱'
                                  : '🏡'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Professional {category.toLowerCase()} services tailored to your needs
                      </p>
                      <Link
                        href={`/contact?provider=${provider._id.toString() || ''}&service=${category
                          .toLowerCase()
                          .replace(' ', '-')}`}
                        className="mt-2 text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
                      >
                        Get a quote
                        <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {(provider.categories || []).length > 3 && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllServices(!showAllServices)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {showAllServices ? 'Show Less' : `Show ${(provider.categories || []).length - 3} More Services`}
                  </Button>
                </div>
              )}
            </section>

            {/* Opening Hours Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Opening Hours</h2>
              <div className="grid gap-2">
                {(provider.openingHours || []).map((hour: string, index: number) => {
                  const [day, hours] = hour.split(': ');
                  return (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium">{day}</span>
                      <span>{hours === 'Open 24 hours' ? '9am - 5pm' : hours}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Enhanced Gallery Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Gallery</h2>
                  <p className="text-sm text-gray-600 mt-1">Before & after transformations</p>
                </div>
                <Button
                  variant="ghost"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All ({provider.imageUrls?.length || 0})
                </Button>
              </div>
              {provider.imageUrls && provider.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {provider.imageUrls.slice(0, 6).map((image: string, index: number) => {
                    // Sample project tags - in real implementation, these would come from the database
                    const projectTags = ['Lawn Mowing', 'Hedge Trimming', 'Sod Installation', 'Landscaping', 'Tree Service', 'Garden Cleanup'];
                    const randomTag = projectTags[index % projectTags.length];
                    
                    return (
                      <div
                        key={index}
                        className="relative aspect-square group overflow-hidden rounded-lg"
                      >
                        <Image
                          src={galleryImageErrors[index] ? defaultImage : image}
                          alt={`${randomTag} project showcase`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={() => setGalleryImageErrors(prev => ({ ...prev, [index]: true }))}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 text-gray-800 text-xs px-2 py-1">
                            {randomTag}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white text-sm font-medium">View Before & After</p>
                            <p className="text-white/80 text-xs">Click to see full project</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>



            {/* FAQs Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    This provider hasn't added any FAQs yet
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Have questions about their services? Please use the contact form to get in touch directly.
                  </p>
                  <Button
                    variant="outline"
                    className="text-primary-600 hover:text-primary-700"
                    onClick={() => {
                      const contactForm = document.getElementById('contact-form');
                      contactForm?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Contact Provider
                  </Button>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                  <p className="text-sm text-gray-600 mt-1">What our customers say about us</p>
                </div>
                {provider.reviewsCount === 0 ? (
                  <Button
                    variant="outline"
                    className="text-primary-600 hover:text-primary-700"
                    onClick={() => handleContactClick('review')}
                  >
                    Leave a Review
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-primary-600 hover:text-primary-700"
                    onClick={() => handleContactClick('review')}
                  >
                    Write a Review
                  </Button>
                )}
              </div>
              {provider.reviewsCount === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No reviews yet. Be the first to review this provider!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Existing reviews content */}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            {/* Contact Form */}
            <Card id="contact-form" className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Contact {provider.title || 'Provider'}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Get a free quote for your lawn care needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => {
                        const result = formSchema.shape.name.safeParse(value);
                        return result.success ? undefined : result.error.message;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        const result = formSchema.shape.email.safeParse(value);
                        return result.success ? undefined : result.error.message;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="phone"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return undefined;
                        const result = formSchema.shape.phone.safeParse(value);
                        return result.success ? undefined : result.error.message;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="service"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return undefined;
                        const result = formSchema.shape.service.safeParse(value);
                        return result.success ? undefined : result.error.message;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          What do you need?
                        </label>
                        <Select value={field.state.value} onValueChange={field.handleChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="quote">Request Quote</SelectItem>
                            {(provider.categories || []).map((category: string, index: number) => (
                              <SelectItem key={index} value={category.toLowerCase()}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="message"
                    validators={{
                      onChange: ({ value }) => {
                        const result = formSchema.shape.message.safeParse(value);
                        return result.success ? undefined : result.error.message;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Message
                        </label>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Tell us about your lawn care needs"
                          className="h-24"
                          required
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">
                            {field.state.meta.errors.join(', ')}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>

                  <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={!canSubmit || formStatus === 'submitting'}
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Request'
                        )}
                      </Button>
                    )}
                  </form.Subscribe>

                  {formStatus === 'success' && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Your message has been sent successfully!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formStatus === 'error' && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            {errorMessage ||
                              'There was an error sending your message. Please try again.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>

                {/* Service Area & Availability */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Service Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Service Area</p>
                        <p className="text-sm text-gray-600">{formatAddress()} & surrounding areas</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Response Time</p>
                        <p className="text-sm text-gray-600">Usually responds within 2 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Availability</p>
                        <p className="text-sm text-gray-600">Taking new clients</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Area Map */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Service Area</h3>
                  <ServiceAreaMap 
                    address={provider.address} 
                    businessName={provider.title || 'Provider'} 
                  />
                </div>

                {/* AI Assistant */}
                <ProviderAIAssistant />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
