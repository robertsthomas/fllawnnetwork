'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '~/contexts/AdminAuthContext';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { LogOut, Users, Eye, Star, Phone, Mail, Globe, Building2 } from 'lucide-react';

// Mock provider data - in production this would come from your database
const mockProviders = [
  {
    _id: 'provider-1',
    name: 'Green Lawn Care Services',
    email: 'contact@greenlawn.com',
    phone: '(555) 123-4567',
    website: 'https://greenlawn.com',
    description: 'Professional lawn care and landscaping services',
    services: ['Lawn Mowing', 'Landscaping', 'Fertilization'],
    serviceArea: ['Miami', 'Fort Lauderdale'],
    rating: 4.8,
    reviewsCount: 24,
    verified: true,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    userId: 'user-1',
  },
  {
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
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    userId: 'user-2',
  },
  {
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
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    userId: 'user-3',
  },
];

export default function AdminDashboardPage() {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();
  const [providers, setProviders] = useState(mockProviders);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, router]);

  if (!admin) {
    return null;
  }

  const handleViewProvider = (providerId: string) => {
    router.push(`/admin/provider/${providerId}`);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {admin.name}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => router.push('/admin/companies')} variant="outline">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Providers</p>
                  <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Badge className="h-8 w-8 text-green-600 bg-green-100" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {providers.filter(p => p.verified).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {providers.reduce((sum, p) => sum + p.reviewsCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Provider List */}
        <Card>
          <CardHeader>
            <CardTitle>All Providers</CardTitle>
            <CardDescription>
              Click on any provider to view detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  key={provider._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewProvider(provider._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {provider.name}
                        </h3>
                        {provider.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{provider.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{provider.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{provider.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span>{provider.website}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {provider.services.slice(0, 3).map((service) => (
                          <Badge key={service} variant="outline">
                            {service}
                          </Badge>
                        ))}
                        {provider.services.length > 3 && (
                          <Badge variant="outline">
                            +{provider.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                        <span>Service Areas: {provider.serviceArea.join(', ')}</span>
                        <span>•</span>
                        <span>Created: {formatDate(provider.createdAt)}</span>
                        <span>•</span>
                        <span>Updated: {formatDate(provider.updatedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-gray-500">({provider.reviewsCount})</span>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 