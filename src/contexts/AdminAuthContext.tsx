'use client';

import React, { createContext, useContext, useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { auth } from "../../convex/auth";

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  userId: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signOut } = useAuthActions();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For now, we'll do a simple check for admin email
      // In production, you'd want to check against the admin table
      if (!email.includes('admin') && email !== 'admin@fllawnnetwork.com') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      console.log("Attempting sign in with email:", email);
      
      // Create a mock result instead of calling signIn for now
      // This helps debug without relying on the Convex auth endpoint
      // When your Convex auth setup is fixed, replace this with:
      // const result = await signIn('password', { email, password });
      
      const mockResult = { success: true };
      
      if (mockResult.success) {
        // Mock admin user for now
        setAdmin({
          _id: 'admin-1',
          email,
          name: 'Admin User',
          role: 'admin',
          userId: 'admin-user-id',
        });
        console.log("Admin login successful:", email);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // If using the mock login above, you might want to skip the actual signOut call
      // await signOut();
      console.log("Admin logged out");
      setAdmin(null);
    } catch (error) {
      console.error('Admin logout error:', error);
      throw error;
    }
  };

  const value = {
    admin,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}; 