'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Provider } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProviderCardProps {
  provider: Provider | { data: Provider };
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  console.log("provider", provider);
  
  // Handle the case where provider data is nested in a data object
  const providerData = 'data' in provider ? provider.data : provider;
  
  const featured = providerData.featured ?? false;
  const featuredImageUrl = providerData.featuredImageUrl || (providerData.imageUrls?.length > 0 ? providerData.imageUrls[0] : '/images/placeholder.jpg');
  const initials = providerData.title?.split(' ').map(word => word[0]).join('').toUpperCase() || 'P';
  
  return (
    <Card className={`h-full overflow-hidden ${featured ? 'border-2 border-accent-500' : ''}`}>
      <div className="relative">
        <Image
          src={featuredImageUrl}
          alt={providerData.title || 'Provider'}
          width={400}
          height={192}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-accent-500 text-white hover:bg-accent-600">
            Featured
          </Badge>
        )}
        <div className="absolute -bottom-6 left-4">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarImage src={featuredImageUrl} alt={`${providerData.title || 'Provider'} logo`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <CardContent className="p-4 pt-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{providerData.title || 'Provider'}</h3>
          <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-800">{(providerData.totalScore || 0).toFixed(1)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-gray-500 ml-1">({providerData.reviewsCount || 0})</span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-grow">{providerData.description || ''}</p>
        
        <div className="mt-3">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {providerData.address && `${providerData.address.city || ''}, ${providerData.address.state || ''}`}
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {providerData.categories?.slice(0, 3).map((service) => (
            <Badge key={service} variant="outline" className="bg-primary-100 text-primary-800 hover:bg-primary-200">
              {service}
            </Badge>
          ))}
          {providerData.categories?.length > 3 && (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
              +{providerData.categories.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex space-x-3">
        <Button asChild variant="default" className="flex-1">
          <Link href={`/providers/${providerData.documentId}`}>
            View Profile
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 border-primary-600 text-primary-600 hover:bg-primary-50">
          <Link href={`/contact?provider=${providerData.documentId}`}>
            Get Quote
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 