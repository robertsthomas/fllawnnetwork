'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface Location {
  city: string;
  state: string;
  postalCode: string;
  lat?: number;
  lng?: number;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location) => void;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Check if we already have a location in localStorage
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          setLocation(JSON.parse(savedLocation));
          setIsLoading(false);
          return;
        }

        // If no saved location, fetch from ipapi.co
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const newLocation = {
          city: data.city,
          state: data.region_code,
          postalCode: data.postal,
          lat: data.latitude,
          lng: data.longitude,
        };

        // Save to localStorage
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
        setLocation(newLocation);
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleSetLocation = (newLocation: Location) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  };

  return (
    <LocationContext.Provider value={{ location, setLocation: handleSetLocation, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
