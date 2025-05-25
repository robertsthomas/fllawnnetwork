'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Provider } from '@/types';

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const featured = provider.featured;
  const featuredImageUrl = provider.featuredImageUrl || (provider.imageUrls.length > 0 ? provider.imageUrls[0] : '/images/placeholder.jpg');
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition transform hover:shadow-lg group h-full flex flex-col ${featured ? 'border-2 border-accent-500' : ''}`}>
      <div className="relative">
        <Image
          src={featuredImageUrl}
          alt={provider.title}
          width={400}
          height={192}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <div className="absolute top-0 right-0 bg-accent-500 text-white px-3 py-1 font-semibold text-sm">
            Featured
          </div>
        )}
        <div className="absolute -bottom-6 left-4">
          <Image
            src={featuredImageUrl}
            alt={`${provider.title} logo`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm"
          />
        </div>
      </div>
      
      <div className="p-4 pt-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{provider.title}</h3>
          <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-800">{provider.totalScore.toFixed(1)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-gray-500 ml-1">({provider.reviewsCount})</span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-grow">{provider.description || ''}</p>
        
        <div className="mt-3">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {provider.address && `${provider.address.city || ''}, ${provider.address.state || ''}`}
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {provider.categories.slice(0, 3).map((service) => (
            <span key={service} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
              {service}
            </span>
          ))}
          {provider.categories.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              +{provider.categories.length - 3} more
            </span>
          )}
        </div>
        
        <div className="mt-4 flex space-x-3">
          <Link 
            href={`/providers/${provider.documentId}`} 
            className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition"
          >
            View Profile
          </Link>
          <Link 
            href={`/contact?provider=${provider.documentId}`} 
            className="flex-1 flex justify-center items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
} 