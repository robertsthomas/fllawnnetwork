'use client';

import { useQuery, useConvexAuth } from 'convex/react';
import { useClerk } from '@clerk/nextjs';
import { createContext, useContext } from 'react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

type Provider = {
  _id: Id<'providers'>;
  title: string;
  email: string | null;
  companyId?: Id<'companies'>;
  role?: string;
  company?: {
    _id: Id<'companies'>;
    name: string;
    description?: string;
    website?: string;
    phone?: string;
    email?: string;
  } | null;
} | null;

interface ProviderAuthContextType {
  isAuthenticated: boolean;
  provider: Provider;
  signOut: () => void;
}

const ProviderAuthContext = createContext<ProviderAuthContextType | undefined>(undefined);

export function ProviderAuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useClerk();
  const provider = useQuery(api.providerAuth.getCurrentProvider);

  return (
    <ProviderAuthContext.Provider
      value={{
        isAuthenticated,
        provider: provider || null,
        signOut,
      }}
    >
      {children}
    </ProviderAuthContext.Provider>
  );
}

export function useProviderAuth() {
  const context = useContext(ProviderAuthContext);
  if (context === undefined) {
    throw new Error('useProviderAuth must be used within a ProviderAuthProvider');
  }
  return context;
} 