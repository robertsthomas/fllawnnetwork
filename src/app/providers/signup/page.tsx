'use client';

import { SignUp } from '@clerk/nextjs';
import MainLayout from '~/components/ui/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function ProviderSignupPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join as a Provider
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up with Google to create your provider account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up with Google</CardTitle>
              <CardDescription>
                Use your Google account to create your provider profile
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SignUp 
                routing="hash"
                fallbackRedirectUrl="/providers/register"
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