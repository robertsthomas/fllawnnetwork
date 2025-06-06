'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useAction, useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import MainLayout from '~/components/ui/MainLayout';
import { api } from '../../../../convex/_generated/api';

const baseSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
  businessName: z.string().min(1, { message: 'Business name is required.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  website: z.string().optional(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  serviceArea: z.string().min(1, { message: 'Service area is required.' }),
});

const formSchema = baseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function ProviderSignupPage() {
  const router = useRouter();
  const signUp = useAction(api.auth.signIn);
  const createProvider = useMutation(api.providerAuth.createProvider);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      phone: '',
      website: '',
      description: '',
      serviceArea: '',
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First, create the user account
        await signUp({
          provider: 'password',
          params: {
            email: value.email,
            password: value.password,
          },
        });

        // Then create the provider profile
        await createProvider({
          title: value.businessName,
          email: value.email,
          phone: value.phone,
          website: value.website || '',
          categories: ['Lawn Care'], // Default category
          address: {
            city: value.serviceArea,
            state: 'FL', // Default to Florida
          },
        });

        // Send welcome email
        await fetch('/api/providers/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: value.businessName,
            email: value.email,
            phone: value.phone,
            businessName: value.businessName,
            serviceArea: value.serviceArea,
            description: value.description,
          }),
        });

        // Redirect to provider dashboard
        router.push('/providers/dashboard');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred during signup');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join as a Provider
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your provider account and start connecting with customers
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field
                  name="email"
                                     validators={{
                     onChange: ({ value }) => {
                       const result = baseSchema.shape.email.safeParse(value);
                       return result.success ? undefined : result.error.message;
                     },
                   }}
                >
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name}>Email Address</Label>
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
                        <p className="mt-2 text-sm text-red-600">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>

                                 <form.Field
                   name="businessName"
                   validators={{
                     onChange: ({ value }) => {
                       const result = baseSchema.shape.businessName.safeParse(value);
                       return result.success ? undefined : result.error.message;
                     },
                   }}
                 >
                   {(field) => (
                     <div>
                       <Label htmlFor={field.name}>Business Name</Label>
                       <Input
                         id={field.name}
                         name={field.name}
                         type="text"
                         value={field.state.value}
                         onBlur={field.handleBlur}
                         onChange={(e) => field.handleChange(e.target.value)}
                         required
                       />
                       {field.state.meta.errors ? (
                         <p className="mt-2 text-sm text-red-600">
                           {field.state.meta.errors.join(', ')}
                         </p>
                       ) : null}
                     </div>
                   )}
                 </form.Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      const result = formSchema.shape.password.safeParse(value);
                      return result.success ? undefined : result.error.message;
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name}>Password</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.errors ? (
                        <p className="mt-2 text-sm text-red-600">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChange: ({ value }) => {
                      const result = formSchema.shape.confirmPassword.safeParse(value);
                      return result.success ? undefined : result.error.message;
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name}>Confirm Password</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.errors ? (
                        <p className="mt-2 text-sm text-red-600">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field
                  name="phone"
                  validators={{
                    onChange: ({ value }) => {
                      const result = formSchema.shape.phone.safeParse(value);
                      return result.success ? undefined : result.error.message;
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name}>Phone Number</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.errors ? (
                        <p className="mt-2 text-sm text-red-600">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="website"
                  validators={{
                    onChange: ({ value }) => {
                      const result = formSchema.shape.website.safeParse(value);
                      return result.success ? undefined : result.error.message;
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name}>Website (Optional)</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="url"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors ? (
                        <p className="mt-2 text-sm text-red-600">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field
                name="serviceArea"
                validators={{
                  onChange: ({ value }) => {
                    const result = formSchema.shape.serviceArea.safeParse(value);
                    return result.success ? undefined : result.error.message;
                  },
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Service Area</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="e.g., Miami, Tampa, Orlando"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                    {field.state.meta.errors ? (
                      <p className="mt-2 text-sm text-red-600">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="description"
                validators={{
                  onChange: ({ value }) => {
                    const result = formSchema.shape.description.safeParse(value);
                    return result.success ? undefined : result.error.message;
                  },
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor={field.name}>Business Description</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      placeholder="Tell customers about your business and services..."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                    {field.state.meta.errors ? (
                      <p className="mt-2 text-sm text-red-600">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Provider Account'}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/providers/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 