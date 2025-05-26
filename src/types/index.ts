export interface Provider {
  data: {
    id: string;
    documentId: string;
    title: string;
    address: {
      street: string | null;
      city: string | null;
      state: string | null;
      postalCode: string | null;
      country?: string | null;
      location?: {
        lat: number;
        lng: number;
      } | null;
    };
    website: string | null;
    phone: string | null;
    phoneUnformatted: string | null;
    featured: boolean;
    categories: string[];
    totalScore: number;
    reviewsCount: number;
    reviewsLink: string | null;
    openingHours: string[];
    openingHoursRaw?: Array<{
      day: string;
      hours: string;
    }>;
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
    domain?: string | null;
    emails?: string[];
    rank?: number | null;
    scrapedAt?: string | null;
  };
  documentId: string;
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

export interface LawnCareProvider {
  title: string;
  price?: any;
  categoryName?: string;
  address?: string;
  neighborhood?: string | null;
  street?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  countryCode?: string;
  website?: string | null;
  phone?: string | null;
  phoneUnformatted?: string | null;
  claimThisBusiness?: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  permanentlyClosed?: boolean;
  temporarilyClosed?: boolean;
  placeId: string;
  categories?: string[];
  fid?: string;
  cid?: string;
  reviewsCount?: number;
  imagesCount?: number;
  imageCategories?: string[];
  scrapedAt?: string;
  openingHours?: Array<{
    day: string;
    hours: string;
  }>;
  imageUrl?: string;
  imageUrls?: string[];
  totalScore?: number;
  reviewsDistribution?: {
    oneStar?: number;
    twoStar?: number;
    threeStar?: number;
    fourStar?: number;
    fiveStar?: number;
  };
  description?: string | null;
  emails?: string[];
  phones?: string[];
  facebooks?: string[];
  instagrams?: string[];
  twitters?: string[];
  youtubes?: string[];
  tiktoks?: string[];
  domain?: string;
  rank?: number;
  ownerUpdates?: any[];
  plusCode?: string | null;
  peopleAlsoSearch?: Array<{
    category: string;
    title: string;
    reviewsCount: number;
    totalScore: number;
  }>;
  reviewsTags?: Array<{
    title: string;
    count: number;
  }>;
  reviews?: Array<{
    reviewerId: string;
    reviewerUrl: string;
    name: string;
    reviewerNumberOfReviews: number;
    isLocalGuide: boolean;
    reviewerPhotoUrl: string;
    text: string;
    textTranslated: string | null;
    publishAt: string;
    publishedAtDate: string;
    likesCount: number;
    reviewId: string;
    reviewUrl: string;
    reviewOrigin: string;
    stars: number;
    rating: any;
    responseFromOwnerDate: string | null;
    responseFromOwnerText: string | null;
    reviewImageUrls: string[];
    reviewContext: any;
    reviewDetailedRating: any;
    visitedIn: string | null;
    originalLanguage: string;
    translatedLanguage: string | null;
  }>;
} 