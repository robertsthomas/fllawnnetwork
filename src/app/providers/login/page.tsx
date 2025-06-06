'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useAction } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import MainLayout from '~/components/ui/MainLayout';
import { api } from '../../../../convex/_generated/api';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProviderLoginPage() {
  const router = useRouter();
  const signIn = useAction(api.auth.signIn);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn({
          provider: 'password',
          params: {
            email: value.email,
            password: value.password,
          },
        });
        
        // Redirect to the provider dashboard
        router.push('/providers/dashboard');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred during login');
      }
    },
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Provider Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your provider dashboard
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = formSchema.shape.email.safeParse(value);
                    return result.success ? undefined : result.error.message;
                  },
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                    </div>
                    {field.state.meta.errors ? (
                      <p className="mt-2 text-sm text-red-600">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

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
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                    </div>
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
                  disabled={form.state.isSubmitting}
                >
                  {form.state.isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 