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
                    Featured Provider
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-full"
                >
                  Verified
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full"
                >
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

      {/* Quick Info Cards */}
      {/* <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">15+</div>
              <div className="mt-1 text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">{provider.reviewsCount || 0}+</div>
              <div className="mt-1 text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">100%</div>
              <div className="mt-1 text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">24/7</div>
              <div className="mt-1 text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Services Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {(provider.categories || []).map((category: string, index: number) => (
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

            {/* Gallery Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
                <Button
                  variant="ghost"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </Button>
              </div>
              {provider.imageUrls && provider.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {provider.imageUrls.slice(0, 6).map((image: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square group overflow-hidden rounded-lg"
                    >
                      <Image
                        src={galleryImageErrors[index] ? defaultImage : image}
                        alt="Project showcase"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={() => setGalleryImageErrors(prev => ({ ...prev, [index]: true }))}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm font-medium">View Project</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Reviews Section */}
            <section className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <Button
                  variant="link"
                  asChild
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {/* <a
                    href={`https://www.google.com/search?q=${provider.title}+reviews`}
                    target="_blank"
                    rel="noopener noreferrer"
                  > */}
                    Write a Review
                  {/* </a> */}
                </Button>
              </div>

              <Card className="bg-primary-50 border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-gray-900">
                        {(provider.totalScore || 0).toFixed(1)}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              i < Math.floor(provider.totalScore || 0)
                                ? 'text-accent-500'
                                : 'text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Based on {provider.reviewsCount || 0} reviews
                      </p>
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
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Request a Quote
                </CardTitle>
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
                          Service
                        </label>
                        <Select value={field.state.value} onValueChange={field.handleChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
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

                {provider.isClaimed && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {provider.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <a href={`tel:${provider.phone}`} className="hover:text-primary-600">
                            {formatPhoneNumber(provider.phone)}
                          </a>
                        </div>
                      )}
                      {provider.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <a href={`mailto:${provider.email}`} className="hover:text-primary-600">
                            {provider.email}
                          </a>
                        </div>
                      )}
                      {provider.website && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <a
                            href={provider.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-600"
                          >
                            {provider.website}
                          </a>
                        </div>
                      )}
                      {(socials.instagram ||
                        socials.facebook ||
                        socials.twitter ||
                        socials.youtube ||
                        socials.tiktok) && (
                        <div className="flex items-center gap-3 mt-4">
                          {socials.instagram && (
                            <a
                              href={socials.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-pink-600 transition-colors"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                              </svg>
                            </a>
                          )}
                          {socials.facebook && (
                            <a
                              href={socials.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </a>
                          )}
                          {socials.twitter && (
                            <a
                              href={socials.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                              </svg>
                            </a>
                          )}
                          {socials.youtube && (
                            <a
                              href={socials.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                            </a>
                          )}
                          {socials.tiktok && (
                            <a
                              href={socials.tiktok}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-black transition-colors"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
