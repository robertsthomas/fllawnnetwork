export interface Provider {
  id: string;
  documentId: string;
  title: string;
  address: {
    street: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country?: string;
  };
  website: string | null;
  phone: string | null;
  featured: boolean;
  categories: string[];
  totalScore: number;
  reviewsCount: number;
  reviewsLink: string | null;
  openingHours: string[];
  imageUrls: string[];
  featuredImageUrl: string | null;
  socials: {
    instagram: string | null;
    twitter: string | null;
    facebook: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
} 