'use client';

import { useState, FormEvent } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';

export default function ProviderRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const formValues = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      businessName: formData.get('businessName') as string,
      serviceArea: formData.get('serviceArea') as string,
      description: formData.get('description') as string,
    };
    
    try {
      const response = await fetch('/api/providers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register provider');
      }
      
      setMessage({
        text: 'Registration successful! Check your email for more information.',
        type: 'success',
      });
      
      // Reset the form
      e.currentTarget.reset();
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Provider Registration</h2>
      
      {message && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name*</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="John Smith" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address*</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number*</Label>
            <Input 
              id="phone" 
              name="phone" 
              placeholder="(555) 123-4567" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name*</Label>
            <Input 
              id="businessName" 
              name="businessName" 
              placeholder="Green Lawn Solutions" 
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serviceArea">Service Area*</Label>
          <Input 
            id="serviceArea" 
            name="serviceArea" 
            placeholder="Tampa, FL and surrounding areas" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description of Services*</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Tell us about your business and the services you provide..." 
            required 
            rows={5}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register as Provider'}
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
} 