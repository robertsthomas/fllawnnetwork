'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

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
  
  // Check if current user is an admin
  const currentAdmin = useQuery(api.admins.getCurrentAdmin);

  useEffect(() => {
    if (currentAdmin) {
      setAdmin({
        _id: currentAdmin._id,
        email: currentAdmin.email,
        name: currentAdmin.name,
        role: currentAdmin.role,
        userId: currentAdmin.userId,
      });
    } else {
      setAdmin(null);
    }
  }, [currentAdmin]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First, authenticate with Convex Auth
      await signIn('password', { email, password });
      
      // The useEffect above will handle setting the admin state
      // once the currentAdmin query returns the admin data
      
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
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