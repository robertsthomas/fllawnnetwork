import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@convex-dev/auth/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,
  providers: defineTable({
    title: v.string(),
    address: v.object({
      street: v.union(v.string(), v.null()),
      city: v.union(v.string(), v.null()),
      state: v.union(v.string(), v.null()),
      postalCode: v.union(v.string(), v.null()),
    }),
    website: v.union(v.string(), v.null()),
    phone: v.union(v.string(), v.null()),
    email: v.union(v.string(), v.null()),
    featured: v.boolean(),
    categories: v.array(v.string()),
    totalScore: v.number(),
    reviewsCount: v.number(),
    reviewsLink: v.union(v.string(), v.null()),
    openingHours: v.array(v.string()),
    imageUrls: v.array(v.string()),
    featuredImageUrl: v.union(v.string(), v.null()),
    socials: v.object({
      instagram: v.union(v.string(), v.null()),
      twitter: v.union(v.string(), v.null()),
      facebook: v.union(v.string(), v.null()),
      youtube: v.union(v.string(), v.null()),
      tiktok: v.union(v.string(), v.null()),
    }),
    isClaimed: v.optional(v.boolean()),
    businessHighlights: v.optional(v.array(v.string())),
    priceRange: v.optional(v.string()),
    responseTime: v.optional(v.string()),
    yearsInBusiness: v.optional(v.number()),
    jobsCompleted: v.optional(v.number()),
    serviceRadius: v.optional(v.number()),
    specialties: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    insuranceVerified: v.optional(v.boolean()),
    licenseNumber: v.optional(v.string()),
    emergencyService: v.optional(v.boolean()),
    freeEstimates: v.optional(v.boolean()),
    userId: v.optional(v.id('users')),
  }).index('byUserId', ['userId']),
  admins: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.string(), // 'super_admin', 'admin', etc.
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(), // This will be linked to the auth user
  }).index('byEmail', ['email'])
    .index('byUserId', ['userId']),
  reviews: defineTable({
    providerId: v.id('providers'),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(), // This will be linked to the auth user
  }).index('byProvider', ['providerId'])
    .index('byUser', ['userId']),
  contacts: defineTable({
    providerId: v.id('providers'),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(), // This will be linked to the auth user
  }).index('byProvider', ['providerId'])
    .index('byUser', ['userId']),
});

export default schema;
