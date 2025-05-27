import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("providers").collect();
    },
});

export const create = mutation({
    args: {
        provider: v.object({
            title: v.string(),
            address: v.object({
                street: v.union(v.string(), v.null()),
                city: v.union(v.string(), v.null()),
                state: v.union(v.string(), v.null()),
                postalCode: v.union(v.string(), v.null())
            }),
            website: v.union(v.string(), v.null()),
            phone: v.union(v.string(), v.null()),
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
                tiktok: v.union(v.string(), v.null())
            }),
            email: v.union(v.string(), v.null()),
            isClaimed: v.boolean()
        }),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("providers", args.provider);
    },
});


export const getProviderById = query({
    args: {
        id: v.id("providers"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const deleteDuplicates = mutation({
    args: {},
    handler: async (ctx) => {
        const allProviders = await ctx.db.query("providers").collect();

        const seenTitles = new Map<string, string>(); // title -> id
        const duplicates: string[] = [];

        for (const provider of allProviders) {
            const title = provider.title?.trim().toLowerCase(); // normalize title
            if (!title) continue;

            if (seenTitles.has(title)) {
                // Duplicate found
                duplicates.push(provider._id);
            } else {
                seenTitles.set(title, provider._id);
            }
        }

        // Delete duplicates
        for (const id of duplicates) {
            await ctx.db.delete(id as Id<"providers">);
        }

        return {
            deletedCount: duplicates.length,
        };
    },
});

export const backfillIsClaimed = mutation(async (ctx) => {
    const records = await ctx.db.query("providers").collect();
  
    for (const record of records) {
      // Skip if already set
      if (record.isClaimed !== undefined) continue;
  
      await ctx.db.patch(record._id, {
        isClaimed: false, // or any default logic
      });
    }
  });


  export const backfillEmail = mutation(async (ctx) => {
    const records = await ctx.db.query("providers").collect();
  
    for (const record of records) {
      // Skip if already set
      if (record.email !== undefined) continue;
  
      await ctx.db.patch(record._id, {
        email: "", // or any default logic
      });
    }
  });