'use client';

import { useForm } from '@tanstack/react-form';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  providerId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const searchParams = useSearchParams();
  const providerId = searchParams.get('provider');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      providerId: providerId || '',
    },
    onSubmit: async ({ value }) => {
      setFormStatus('submitting');
      setErrorMessage(null);

      try {
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to send message');
        }

        setFormStatus('success');
        form.reset();
      } catch (error) {
        console.error('Error sending form:', error);
        setFormStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.name.safeParse(value);
            return result.success ? undefined : result.error.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Your name"
            />
            {field.state.meta.errors ? (
              <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="your.email@example.com"
              />
              {field.state.meta.errors ? (
                <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>

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
            <div className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <Input
                id={field.name}
                name={field.name}
                type="tel"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="(123) 456-7890"
              />
              {field.state.meta.errors ? (
                <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field
        name="message"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.message.safeParse(value);
            return result.success ? undefined : result.error.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Tell us what you're looking for..."
              className="min-h-[120px]"
            />
            {field.state.meta.errors ? (
              <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      {providerId && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                You are requesting a quote from provider ID: {providerId}
              </p>
            </div>
          </div>
        </div>
      )}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || formStatus === 'submitting'}
            className="w-full"
          >
            {formStatus === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        )}
      </form.Subscribe>

      {formStatus === 'success' && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Your message has been sent successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {formStatus === 'error' && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errorMessage || 'There was an error sending your message. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
