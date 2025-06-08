import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

export const getCurrentAdmin = query({
  args: {},
  returns: v.union(v.object({
    _id: v.id('admins'),
    email: v.string(),
    name: v.string(),
    role: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(),
    _creationTime: v.number(),
  }), v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const admin = await ctx.db
      .query('admins')
      .withIndex('byUserId', (q: any) => q.eq('userId', identity.subject))
      .first();
    return admin;
  },
});

export const hasAnyAdmins = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const firstAdmin = await ctx.db.query('admins').first();
    return firstAdmin !== null;
  },
});

export const getAdminByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query('admins')
      .withIndex('byUserId', (q: any) => q.eq('userId', args.userId))
      .first();
    return admin;
  },
});

export const getAdminByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query('admins')
      .withIndex('byEmail', (q: any) => q.eq('email', args.email))
      .first();
    return admin;
  },
});

export const createAdmin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    userId: v.string(),
  },
  returns: v.id('admins'),
  handler: async (ctx, args) => {
    const existingAdmin = await ctx.db
      .query('admins')
      .withIndex('byEmail', (q: any) => q.eq('email', args.email))
      .first();

    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    const adminId = await ctx.db.insert('admins', {
      email: args.email,
      name: args.name,
      role: args.role || 'admin',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: args.userId,
    });

    return adminId;
  },
});

export const createAdminFromAuth = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
  },
  returns: v.union(v.id('admins'), v.null()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Check if admin already exists
    const existingAdmin = await ctx.db
      .query('admins')
      .withIndex('byUserId', (q: any) => q.eq('userId', identity.subject))
      .first();

    if (existingAdmin) {
      return existingAdmin._id;
    }

    // Create new admin
    const adminId = await ctx.db.insert('admins', {
      email: args.email,
      name: args.name,
      role: args.role || 'admin',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: identity.subject,
    });

    return adminId;
  },
});

export const getAllProviders = query({
  args: {},
  handler: async (ctx) => {
    // This function will be used by admins to view all providers
    const providers = await ctx.db.query('providers').collect();
    return providers;
  },
});

export const getProviderAnalytics = query({
  args: {
    providerId: v.id('providers'),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    // Get contact requests for this provider
    const contacts = await ctx.db
      .query('contacts')
      .withIndex('byProvider', (q) => q.eq('providerId', args.providerId))
      .collect();

    // Get reviews for this provider
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('byProvider', (q) => q.eq('providerId', args.providerId))
      .collect();

    // Calculate analytics
    const totalContacts = contacts.length;
    const contactsThisMonth = contacts.filter(
      (contact) => contact.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000
    ).length;
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    return {
      provider,
      analytics: {
        totalContacts,
        contactsThisMonth,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
      },
      recentContacts: contacts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10),
      recentReviews: reviews.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    };
  },
}); 