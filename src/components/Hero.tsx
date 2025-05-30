'use client';

import { useForm } from '@tanstack/react-form';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

const FormSchema = z.object({
  zipcode: z
    .string()
    .min(1, { message: 'Please enter a city or ZIP code' })
    .refine(
      (val) => {
        // Allow either a 5-digit ZIP code or a city name
        return /^\d{5}$/.test(val) || /^[a-zA-Z\s-]+$/.test(val);
      },
      { message: 'Please enter a valid city name or 5-digit ZIP code' }
    ),
});

const isValidZipcode = (value: string): boolean => {
  return /^\d{5}$/.test(value);
};

export default function Hero() {
  const form = useForm({
    defaultValues: {
      zipcode: '',
    },
    onSubmit: ({ value }) => {
      const location = value.zipcode.trim();
      if (isValidZipcode(location)) {
        window.location.href = `/lawn-care?zipcode=${encodeURIComponent(location)}`;
      } else {
        const formattedCity = location.toLowerCase().replace(/\s+/g, '-');
        window.location.href = `/lawn-care/${formattedCity}`;
      }
    },
  });

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-primary-900/90 overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Beautiful lawn"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>

      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-in">
          Find the Perfect
          <br />
          <span className="text-accent-400">Lawn Care Professional</span>
        </h1>
        <p className="mt-6 text-xl text-gray-100 max-w-3xl animate-slide-up">
          Connect with top-rated lawn care providers in your area. From regular mowing to complete
          landscape transformations, find the right expert for your outdoor space.
        </p>

        <div
          className="mt-10 max-w-xl animate-slide-up bg-white/95 backdrop-blur-sm rounded-lg p-4"
          style={{ animationDelay: '200ms' }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <form.Field
              name="zipcode"
              validators={{
                onChange: ({ value }) => {
                  const result = FormSchema.shape.zipcode.safeParse(value);
                  return result.success ? undefined : result.error.message;
                },
              }}
            >
              {(field) => (
                <div className="flex-grow relative">
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const value = e.target.value;
                      // If the input starts with a number, limit to 5 digits
                      if (/^\d/.test(value)) {
                        field.handleChange(value.slice(0, 5));
                      } else {
                        field.handleChange(value);
                      }
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData('text');
                      // If the pasted text contains numbers
                      if (/\d/.test(pastedText)) {
                        e.preventDefault();
                        // Extract only numbers from the pasted text
                        const numbersOnly = pastedText.replace(/\D/g, '');
                        // Take only the first 5 digits
                        field.handleChange(numbersOnly.slice(0, 5));
                      }
                    }}
                    placeholder="Enter city or ZIP code"
                    className="w-full pl-10"
                    required
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  {field.state.meta.errors ? (
                    <p className="text-sm text-red-500 mt-1.5 px-1">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit]) => (
                <Button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={!canSubmit}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="text-sm text-black/80">Popular:</span>
            <Link href="/lawn-care" className="text-sm text-black hover:text-green-700 transition">
              Lawn Mowing
            </Link>
            <span className="text-sm text-black/80">•</span>
            <Link href="/lawn-care" className="text-sm text-black hover:text-green-700 transition">
              Landscaping
            </Link>
            <span className="text-sm text-black/80">•</span>
            <Link href="/lawn-care" className="text-sm text-black hover:text-green-700 transition">
              Garden Design
            </Link>
            <span className="text-sm text-black/80">•</span>
            <Link href="/lawn-care" className="text-sm text-black hover:text-green-700 transition">
              Irrigation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
