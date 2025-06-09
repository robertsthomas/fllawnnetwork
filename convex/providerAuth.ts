import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

export const getProviderByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db
      .query('providers')
      .withIndex('byUserId', (q: any) => q.eq('userId', args.userId))
      .first();
    return provider;
  },
});

export const getCurrentProvider = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const provider = await ctx.db
      .query('providers')
      .withIndex('byUserId', (q: any) => q.eq('userId', identity.subject))
      .first();
    
    if (!provider) {
      return null;
    }

    // Get company information if provider is linked to a company
    let company = null;
    if (provider.companyId) {
      company = await ctx.db.get(provider.companyId);
    }

    return {
      ...provider,
      company,
    };
  },
});

export const createProvider = mutation({
  args: {
    title: v.string(),
    email: v.string(),
    phone: v.string(),
    website: v.string(),
    categories: v.array(v.string()),
    address: v.object({
      street: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postalCode: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const existingProvider = await ctx.db
      .query('providers')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();

    if (existingProvider) {
      throw new Error('Provider with this email already exists');
    }

    const providerId = await ctx.db.insert('providers', {
      title: args.title,
      email: args.email,
      phone: args.phone,
      website: args.website,
      categories: args.categories,
      address: {
        street: args.address.street || null,
        city: args.address.city,
        state: args.address.state,
        postalCode: args.address.postalCode || null,
      },
      featured: false,
      totalScore: 0,
      reviewsCount: 0,
      reviewsLink: null,
      openingHours: [],
      imageUrls: [],
      featuredImageUrl: null,
      socials: {
        instagram: null,
        twitter: null,
        facebook: null,
        youtube: null,
        tiktok: null,
      },
      isClaimed: true,
      userId: identity.subject,
    });

    return providerId;
  },
});

export const updateProvider = mutation({
  args: {
    id: v.id('providers'),
    title: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postalCode: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const provider = await ctx.db.get(args.id);
    if (!provider) {
      throw new Error('Provider not found');
    }

    if (provider.userId !== identity.subject) {
      throw new Error('Not authorized');
    }

    const { id, ...updates } = args;
    const updateData: any = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.website !== undefined) updateData.website = updates.website;
    if (updates.categories !== undefined) updateData.categories = updates.categories;
    if (updates.address !== undefined) {
      updateData.address = {
        street: updates.address.street || null,
        city: updates.address.city,
        state: updates.address.state,
        postalCode: updates.address.postalCode || null,
      };
    }

    await ctx.db.patch(id, updateData);

    return id;
  },
});

export const deleteProvider = mutation({
  args: {
    id: v.id('providers'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const provider = await ctx.db.get(args.id);
    if (!provider) {
      throw new Error('Provider not found');
    }

    if (provider.userId !== identity.subject) {
      throw new Error('Not authorized');
    }

    await ctx.db.delete(args.id);
  },
}); 