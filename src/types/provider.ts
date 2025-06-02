export interface Provider {
  _id: string;
  name: string;
  slug: string;
  location: string;
  imageUrl?: string;
  services: string[];
  description?: string;
  rating?: number;
  reviewCount?: number;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  address?: {
    street?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
} 