import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
        throw new Error('not authenticated')
    }
    return await ctx.storage.generateUploadUrl();
});

export const uploadFile = mutation({
    args: { file: v.id('_storage'), title: v.string(), description: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('not authenticated')
        }
        return ctx.db.insert('files', {
            file: args.file,
            title: args.title,
            description: args.description,

        })
    }

})

export const getFileUrl = query({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('not authenticated');
        }
        const file = await ctx.db.get(args.fileId);
        if (!file) {
            throw new ConvexError('file not found');
        }
        const url = await ctx.storage.getUrl(file.file);
        return url;
    }
});


export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('not authenticated')
        }
        const file = await ctx.db.get(args.fileId)
        if (!file) {
            throw new ConvexError('file not found')
        }
        await ctx.db.delete(args.fileId)
    }
})

export const getFiles = query({
    args: {},
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            return []
        }
        return ctx.db.query('files').collect()
    }
})