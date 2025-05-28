import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lawn Care Services in Florida | Find Local Providers',
  description: 'Find the best lawn care services in your city. Browse our directory of trusted lawn care professionals in Florida.',
};

export default function LawnCareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 