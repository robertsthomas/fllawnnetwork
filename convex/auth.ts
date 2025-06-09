// This file now handles Clerk-based authentication with Convex
// Convex functions can access Clerk user data through the auth context

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Get the current user from Clerk authentication
 * This will be used throughout the app to get user information
 */
export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      id: v.string(),
      email: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return {
      id: identity.subject,
      email: identity.email,
      firstName: typeof identity.given_name === 'string' ? identity.given_name : undefined,
      lastName: typeof identity.family_name === 'string' ? identity.family_name : undefined,
      imageUrl: typeof identity.picture === 'string' ? identity.picture : undefined,
    };
  },
});

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return !!identity;
  },
}); 