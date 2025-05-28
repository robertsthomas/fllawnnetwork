'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '~/components/ui/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { CheckCircle2 } from 'lucide-react';

export default function ClaimBusinessPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationInfo, setVerificationInfo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/claim-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: id,
          name,
          email,
          phone,
          verificationInfo
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit claim request');
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting claim:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-accent-100 bg-white">
          <CardHeader className="bg-accent-50 border-b border-accent-100">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSubmitted ? 'Claim Request Submitted' : 'Claim Your Business'}
            </CardTitle>
            <CardDescription>
              {isSubmitted 
                ? 'Thank you for submitting your claim request. Our team will review it shortly.'
                : 'Verify your ownership to unlock additional features and manage your business listing.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Verification in progress</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We've received your claim request and will contact you via email within 1-2 business days to verify your ownership.
                </p>
                <Button 
                  onClick={() => router.push(`/providers/${id}`)} 
                  className="mt-6"
                >
                  Return to Business Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Business Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500">Must be an email associated with the business domain</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Business Phone</label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="verification" className="block text-sm font-medium text-gray-700">
                    Verification Information
                  </label>
                  <Textarea 
                    id="verification" 
                    value={verificationInfo} 
                    onChange={(e) => setVerificationInfo(e.target.value)} 
                    required 
                    className="mt-1 h-24"
                    placeholder="Please provide additional information to help us verify your ownership (e.g., business license number, website admin credentials, etc.)"
                  />
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button type="submit" className="flex-1">
                    Submit Claim Request
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push(`/providers/${id}`)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 px-6 py-4 border-t">
            <p className="text-xs text-gray-500">
              After submitting your claim, our team will review your information and may request additional verification. Once verified, you'll gain full access to manage your business listing.
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
} 