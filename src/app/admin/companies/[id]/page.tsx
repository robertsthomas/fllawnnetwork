'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '~/contexts/AdminAuthContext';
import { useQuery, useMutation } from 'convex/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { ArrowLeft, Plus, Users, UserMinus, Building2, Phone, Mail, Globe } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

interface Provider {
  _id: Id<'providers'>;
  title: string;
  email: string | null;
  phone: string | null;
  role?: string;
  isActive?: boolean;
  userId?: Id<'users'>;
  _creationTime: number;
}

export default function CompanyProvidersPage() {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as Id<'companies'>;
  
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<Id<'providers'> | ''>('');
  const [selectedRole, setSelectedRole] = useState<string>('employee');

  const company = useQuery(api.companies.getCompanyById, { id: companyId });
  const companyProviders = useQuery(api.companies.getCompanyProviders, { companyId });
  const allProviders = useQuery(api.providers.get);
  const assignProvider = useMutation(api.companies.assignProviderToCompany);
  const removeProvider = useMutation(api.companies.removeProviderFromCompany);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, router]);

  if (!admin) {
    return null;
  }

  // Get providers that are not already assigned to this company
  const availableProviders = allProviders?.filter((provider: any) => 
    !companyProviders?.some(cp => cp._id === provider._id)
  ) || [];

  const handleAssignProvider = async () => {
    if (!selectedProviderId) return;

    try {
      await assignProvider({
        providerId: selectedProviderId as Id<'providers'>,
        companyId,
        role: selectedRole,
      });
      setIsAssignDialogOpen(false);
      setSelectedProviderId('');
      setSelectedRole('employee');
    } catch (error) {
      console.error('Error assigning provider:', error);
      alert('Failed to assign provider to company');
    }
  };

  const handleRemoveProvider = async (providerId: Id<'providers'>) => {
    if (!confirm('Are you sure you want to remove this provider from the company?')) {
      return;
    }

    try {
      await removeProvider({ providerId });
    } catch (error) {
      console.error('Error removing provider:', error);
      alert('Failed to remove provider from company');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (company === undefined || companyProviders === undefined) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/companies')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-sm text-gray-600">Manage providers for this company</p>
              </div>
            </div>
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={availableProviders.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Provider
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Provider to {company.name}</DialogTitle>
                  <DialogDescription>
                    Select a provider to assign to this company and choose their role.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider
                    </label>
                    <Select value={selectedProviderId as string} onValueChange={(value) => setSelectedProviderId(value as Id<'providers'>)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProviders.map((provider: any) => (
                          <SelectItem key={provider._id} value={provider._id}>
                            {provider.title} {provider.email && `(${provider.email})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignProvider} disabled={!selectedProviderId}>
                      Assign Provider
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  {company.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {company.email}
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {company.phone}
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {company.description && (
                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{company.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Providers */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Providers ({companyProviders.length})
                </CardTitle>
                <CardDescription>
                  Providers assigned to this company
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {companyProviders.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No providers assigned</h3>
                <p className="text-gray-600 mb-4">
                  This company doesn't have any providers assigned yet.
                </p>
                {availableProviders.length > 0 && (
                  <Button onClick={() => setIsAssignDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign First Provider
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyProviders.map((provider) => (
                  <Card key={provider._id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{provider.title}</h3>
                          <p className="text-sm text-gray-600">
                            Joined {formatDate(provider._creationTime)}
                          </p>
                        </div>
                        {provider.role && (
                          <Badge className={getRoleBadgeColor(provider.role)}>
                            {provider.role}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        {provider.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-2" />
                            {provider.email}
                          </div>
                        )}
                        {provider.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            {provider.phone}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge variant={provider.isActive !== false ? 'default' : 'secondary'}>
                          {provider.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProvider(provider._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 