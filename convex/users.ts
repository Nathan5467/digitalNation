
import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        name: v.string(),
        image: v.string(),
        role: v.optional(v.string()),          // 可选字段
        organization: v.optional(v.string()),  // 可选字段
        bio: v.optional(v.string()),           // 可选字段
        researchInterests: v.optional(v.string()),  // 可选字段
        email: v.optional(v.string())
    },
    async handler(ctx, args) {
        await ctx.db.insert('users', {
            tokenIdentifier: args.tokenIdentifier,
            name: args.name,
            image: args.image,
            role: args.role !== null ? args.role : undefined,
            organization: args.organization !== null ? args.organization : undefined,
            bio: args.bio !== null ? args.bio : undefined,
            researchInterests: args.researchInterests !== null ? args.researchInterests : undefined,
            email: args.email ? args.email : undefined
        })
    }
})

export const updateUserProfile = mutation({
    args: {
        username: v.optional(v.string()),
        role: v.optional(v.string()),
        organization: v.optional(v.string()),
        bio: v.optional(v.string()),
        researchInterests: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated");
        }
        // 确认 tokenIdentifier 包含正确的前缀
        const tokenIdentifier = identity.tokenIdentifier.startsWith("https://undefined|")
            ? identity.tokenIdentifier
            : `https://undefined|${identity.tokenIdentifier.split("|")[1]}`;


        const user = await ctx.db
            .query("users")
            .filter(q => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
            .first();
        if (!user) {
            throw new Error("user not found");
        }
        const { username, role, organization, bio, researchInterests } = args;
        await ctx.db.patch(user._id, {
            username,
            role,
            organization,
            bio,
            researchInterests,
        });

        const updatedUser = await ctx.db.get(user._id);

        return {
            status: "success",
            user: updatedUser
        };

    }
});

export const getCurrentUser = query({
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null
        }

        // 确认 tokenIdentifier 包含正确的前缀
        const tokenIdentifier = identity.tokenIdentifier.startsWith("https://undefined|")
            ? identity.tokenIdentifier
            : `https://undefined|${identity.tokenIdentifier.split("|")[1]}`;


        const user = await ctx.db
            .query("users")
            .filter(q => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        return user

    }
})
