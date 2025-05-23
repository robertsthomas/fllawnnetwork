export interface Provider {
  id: string;
  documentId: string;
  title: string;
  description: string;
  featuredImageUrl: string;
  featured: boolean;
  categories: string[];
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  reviews: {
    stars: number;
    count: number;
    link: string;
  };
  reviewsLink?: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
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