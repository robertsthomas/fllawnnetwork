import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// Check if user is an admin
async function isAdmin(ctx: any, userId: string) {
  const admin = await ctx.db
    .query('admins')
    .withIndex('byUserId', (q: any) => q.eq('userId', userId))
    .first();
  return !!admin;
}

export const getAllCompanies = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('companies'),
    name: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })),
    logo: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id('users'),
    _creationTime: v.number(),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    if (!(await isAdmin(ctx, userId))) {
      throw new Error('Admin access required');
    }

    return await ctx.db.query('companies').collect();
  },
});

export const getCompanyById = query({
  args: { id: v.id('companies') },
  returns: v.union(v.object({
    _id: v.id('companies'),
    name: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })),
    logo: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id('users'),
    _creationTime: v.number(),
  }), v.null()),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    if (!(await isAdmin(ctx, userId))) {
      throw new Error('Admin access required');
    }

    return await ctx.db.get(args.id);
  },
});

export const createCompany = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })),
    logo: v.optional(v.string()),
  },
  returns: v.id('companies'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    if (!(await isAdmin(ctx, userId))) {
      throw new Error('Admin access required');
    }

    // Check if company with this name already exists
    const existingCompany = await ctx.db
      .query('companies')
      .withIndex('byName', (q) => q.eq('name', args.name))
      .first();

    if (existingCompany) {
      throw new Error('Company with this name already exists');
    }

    const now = Date.now();
    return await ctx.db.insert('companies', {
      name: args.name,
      description: args.description,
      website: args.website,
      phone: args.phone,
      email: args.email,
      address: args.address,
      logo: args.logo,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    });
  },
});

export const updateCompany = mutation({
  args: {
    id: v.id('companies'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })),
    logo: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    if (!(await isAdmin(ctx, userId))) {
      throw new Error('Admin access required');
    }

    const company = await ctx.db.get(args.id);
    if (!company) {
      throw new Error('Company not found');
    }

    const { id, ...updates } = args;
    const updateData: any = { ...updates, updatedAt: Date.now() };

    await ctx.db.patch(id, updateData);
    return null;
  },
});

export const deleteCompany = mutation({
  args: { id: v.id('companies') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    if (!(await isAdmin(ctx, userId))) {
      throw new Error('Admin access required');
    }

    const company = await ctx.db.get(args.id);
    if (!company) {
      throw new Error('Company not found');
    }

    // Check if any providers are linked to this company
    const linkedProviders = await ctx.db
      .query('providers')
      .withIndex('byCompany', (q) => q.eq('companyId', args.id))
      .collect();

    if (linkedProviders.length > 0) {
      throw new Error('Cannot delete company with linked providers. Please unlink providers first.');
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

export const getCompanyProviders = query({
  args: { companyId: v.id('companies') },
  returns: v.array(v.object({
    _id: v.id('providers'),
    title: v.string(),
    email: v.union(v.string(), v.null()),
    phone: v.union(v.string(), v.null()),
    role: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    userId: v.optional(v.id('users')),
    _creationTime: v.number(),
  })),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    if (!(await isAdmin(ctx, userId))) {
      throw new Error('Admin access required');
    }

    return await ctx.db
      .query('providers')
      .withIndex('byCompany', (q) => q.eq('companyId', args.companyId))
      .collect();
  },
});

export const assignProviderToCompany = mutation({
  args: {
    providerId: v.id('providers'),
    companyId: v.id('companies'),
    role: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    if (!(await isAdmin(ctx, userId))) {
      throw new Error('Admin access required');
    }

    const provider = await ctx.db.get(args.providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    await ctx.db.patch(args.providerId, {
      companyId: args.companyId,
      role: args.role || 'employee',
    });

    return null;
  },
});

export const removeProviderFromCompany = mutation({
  args: { providerId: v.id('providers') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    if (!(await isAdmin(ctx, userId))) {
      throw new Error('Admin access required');
    }

    const provider = await ctx.db.get(args.providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    await ctx.db.patch(args.providerId, {
      companyId: undefined,
      role: undefined,
    });

    return null;
  },
}); 