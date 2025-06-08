'use client';

import { SignIn } from '@clerk/nextjs';
import MainLayout from '~/components/ui/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function ProviderLoginPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Provider Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with Google to access your provider dashboard
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Sign In with Google</CardTitle>
              <CardDescription>
                Use your Google account to access your provider dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SignIn 
                routing="hash"
                fallbackRedirectUrl="/providers/dashboard"
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
        </div>
      </div>
    </MainLayout>
  );
} 