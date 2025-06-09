'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp, useClerk, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Shield, User, LogOut } from 'lucide-react';
import { api } from '../../../../convex/_generated/api';
import { SignUp } from '@clerk/nextjs';

export default function AdminSetupPage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded: userLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });

  const createAdmin = useMutation(api.admins.createAdminFromAuth);
  const hasAnyAdmins = useQuery(api.admins.hasAnyAdmins);

  // Check if user is already signed in and populate form data
  useEffect(() => {
    if (user && userLoaded) {
      setFormData({
        name: user.fullName || '',
      });
    }
  }, [user, userLoaded]);

  // Handle creating admin for already authenticated user
  const handleCreateAdminForExistingUser = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await createAdmin({
        email: user.primaryEmailAddress?.emailAddress || '',
        name: formData.name || user.fullName || '',
        role: 'super_admin',
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Admin creation error:', error);
      setError(error?.message || 'Failed to create admin account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setFormData({ name: '' });
      // Force redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Account Created!</h2>
            <p className="text-gray-600 mb-4">
              Your admin account has been successfully created. You'll be redirected to the dashboard.
            </p>
            <Button onClick={() => router.push('/admin/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking user status
  if (!userLoaded || hasAnyAdmins === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Checking authentication status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is already signed in, show option to create admin for existing account
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Setup
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You're signed in with Google. Create admin privileges for your account.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Admin Account</CardTitle>
              <CardDescription>
                You're signed in as {user.primaryEmailAddress?.emailAddress}. 
                Create admin privileges for this account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <Label htmlFor="name">Admin Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will be displayed in the admin dashboard
                </p>
              </div>

              <Button
                onClick={handleCreateAdminForExistingUser}
                className="w-full"
                disabled={isLoading || !formData.name.trim()}
              >
                {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </Button>

              <div className="text-center">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out and use different account
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              This will create admin privileges for your existing Google account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not signed in, show Google signup
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up with Google to create your first admin account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up with Google</CardTitle>
            <CardDescription>
              Use your Google account to create the first admin account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SignUp 
              routing="hash"
              fallbackRedirectUrl="/admin/setup"
              appearance={{
                elements: {
                  card: 'shadow-none border-0',
                  socialButtonsBlockButton: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
                  socialButtonsBlockButtonText: 'font-medium',
                  formFieldInput: 'hidden',
                  formFieldLabel: 'hidden',
                  dividerLine: 'hidden',
                  dividerText: 'hidden',
                  formButtonPrimary: 'hidden',
                  footerAction: 'hidden',
                  identityPreviewText: 'hidden',
                  identityPreviewEditButton: 'hidden',
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  showOptionalFields: false,
                }
              }}
            />
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This page should only be used for initial setup. After creating your admin account, 
            you can create additional admins through the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
} 