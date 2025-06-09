'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '~/contexts/AdminAuthContext';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { ArrowLeft, Users, MessageCircle, Star, TrendingUp, Calendar, Phone, Mail, Globe, MapPin } from 'lucide-react';

// Mock data - in production this would come from your database
const mockProviderData = {
  'provider-1': {
    _id: 'provider-1',
    name: 'Green Lawn Care Services',
    email: 'contact@greenlawn.com',
    phone: '(555) 123-4567',
    website: 'https://greenlawn.com',
    description: 'Professional lawn care and landscaping services with over 10 years of experience',
    services: ['Lawn Mowing', 'Landscaping', 'Fertilization', 'Weed Control'],
    serviceArea: ['Miami', 'Fort Lauderdale', 'Boca Raton'],
    rating: 4.8,
    reviewsCount: 24,
    verified: true,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    userId: 'user-1',
    analytics: {
      totalContacts: 45,
      contactsThisMonth: 12,
      totalReviews: 24,
      averageRating: 4.8,
    },
    recentContacts: [
      { _id: '1', name: 'John Smith', email: 'john@example.com', phone: '555-0123', message: 'Need lawn mowing service', createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
      { _id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0456', message: 'Interested in landscaping', createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
    ],
    recentReviews: [
      { _id: '1', rating: 5, comment: 'Excellent service! Very professional team.', createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
      { _id: '2', rating: 4, comment: 'Good work, arrived on time.', createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000 },
    ],
  },
  'provider-2': {
    _id: 'provider-2',
    name: 'Perfect Yards LLC',
    email: 'info@perfectyards.com',
    phone: '(555) 987-6543',
    website: 'https://perfectyards.com',
    description: 'Complete yard maintenance and design services',
    services: ['Yard Maintenance', 'Garden Design', 'Tree Service'],
    serviceArea: ['Orlando', 'Tampa'],
    rating: 4.6,
    reviewsCount: 18,
    verified: false,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    userId: 'user-2',
    analytics: {
      totalContacts: 32,
      contactsThisMonth: 8,
      totalReviews: 18,
      averageRating: 4.6,
    },
    recentContacts: [
      { _id: '3', name: 'Mike Davis', email: 'mike@example.com', phone: '555-0789', message: 'Tree removal needed', createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
    ],
    recentReviews: [
      { _id: '3', rating: 5, comment: 'Great garden design work!', createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000 },
    ],
  },
  'provider-3': {
    _id: 'provider-3',
    name: 'Sunshine Landscaping',
    email: 'hello@sunshinelandscaping.com',
    phone: '(555) 456-7890',
    website: 'https://sunshinelandscaping.com',
    description: 'Beautiful landscaping solutions for your property',
    services: ['Landscaping', 'Irrigation', 'Outdoor Lighting'],
    serviceArea: ['Jacksonville', 'Gainesville'],
    rating: 4.9,
    reviewsCount: 31,
    verified: true,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    userId: 'user-3',
    analytics: {
      totalContacts: 58,
      contactsThisMonth: 15,
      totalReviews: 31,
      averageRating: 4.9,
    },
    recentContacts: [
      { _id: '4', name: 'Lisa Wilson', email: 'lisa@example.com', phone: '555-0321', message: 'Outdoor lighting installation', createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
    ],
    recentReviews: [
      { _id: '4', rating: 5, comment: 'Amazing irrigation system installation!', createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
    ],
  },
};

export default function ProviderAnalyticsPage() {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const providerId = params.id as string;
  
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    // Get provider data
    const providerData = mockProviderData[providerId as keyof typeof mockProviderData];
    if (providerData) {
      setProvider(providerData);
    } else {
      router.push('/admin/dashboard');
    }
  }, [admin, providerId, router]);

  if (!admin || !provider) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="ghost"
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
              <p className="text-sm text-gray-600">Provider Analytics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                {provider.name}
                {provider.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium text-lg">{provider.rating}</span>
                <span className="text-gray-500">({provider.reviewsCount} reviews)</span>
              </div>
            </div>
            <CardDescription>{provider.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{provider.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{provider.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <p className="font-medium text-blue-600">{provider.website}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Joined</p>
                  <p className="font-medium">{formatDate(provider.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((service: string) => (
                    <Badge key={service} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service Areas</h4>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{provider.serviceArea.join(', ')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{provider.analytics.totalContacts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{provider.analytics.contactsThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{provider.analytics.totalReviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{provider.analytics.averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>Latest customer inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {provider.recentContacts.length > 0 ? (
                  provider.recentContacts.map((contact: any) => (
                    <div key={contact._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{contact.name}</h4>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(contact.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Email:</strong> {contact.email}</p>
                        <p><strong>Phone:</strong> {contact.phone}</p>
                        <p><strong>Message:</strong> {contact.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent contacts</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {provider.recentReviews.length > 0 ? (
                  provider.recentReviews.map((review: any) => (
                    <div key={review._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent reviews</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 