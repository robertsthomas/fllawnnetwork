import type { Metadata } from 'next';
import { Suspense } from 'react';
import MainLayout from '@/components/ui/MainLayout';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Lawn Care Directory',
  description: 'Contact us or request a quote from a lawn care provider.',
};

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="relative max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h1>
            <p className="mt-4 text-lg leading-6 text-gray-500">
              Have questions about our directory? Or looking to get a quote from a provider? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          <div className="mt-12">
            <Suspense fallback={<div>Loading contact form...</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 