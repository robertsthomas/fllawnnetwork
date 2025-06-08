'use client';

import { SignIn } from '@clerk/nextjs';
import { Authenticated, Unauthenticated } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Shield } from 'lucide-react';
import { api } from '../../../../convex/_generated/api';

function RedirectToDashboard() {
  const router = useRouter();
  const currentAdmin = useQuery(api.admins.getCurrentAdmin);
  const hasAnyAdmins = useQuery(api.admins.hasAnyAdmins);
  
  useEffect(() => {
    if (currentAdmin) {
      // User has admin record, go to dashboard
      router.push('/admin/dashboard');
    } else if (currentAdmin === null && hasAnyAdmins === false) {
      // No admin record for user and no admins exist, go to setup
      router.push('/admin/setup');
    } else if (currentAdmin === null && hasAnyAdmins === true) {
      // No admin record for user but other admins exist, stay on login
      // This means the user is authenticated but not an admin
      return;
    }
  }, [currentAdmin, hasAnyAdmins, router]);

  if (currentAdmin === undefined || hasAnyAdmins === undefined) {
    return (
      <div className="text-center">
        <Shield className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Checking Admin Status</h2>
        <p className="mt-2 text-sm text-gray-600">Please wait...</p>
      </div>
    );
  }

  if (currentAdmin === null && hasAnyAdmins === true) {
    return (
      <div className="text-center">
        <Shield className="mx-auto h-12 w-12 text-red-600" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-sm text-gray-600">
          You are signed in but don't have admin privileges. Please contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Shield className="mx-auto h-12 w-12 text-green-600" />
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Already Signed In</h2>
      <p className="mt-2 text-sm text-gray-600">Redirecting to dashboard...</p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Authenticated>
          <RedirectToDashboard />
        </Authenticated>

        <Unauthenticated>
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in with Google to access the admin dashboard
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In with Google</CardTitle>
              <CardDescription>
                Use your Google account to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SignIn 
                routing="hash"
                fallbackRedirectUrl="/admin/dashboard"
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
        </Unauthenticated>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          Need to sign out? <a href="/admin/signout" className="text-blue-600 hover:text-blue-500">Click here</a>
        </p>
      </div>
    </div>
  );
} 