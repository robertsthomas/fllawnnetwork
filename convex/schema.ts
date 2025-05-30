import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
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
  }),
});
