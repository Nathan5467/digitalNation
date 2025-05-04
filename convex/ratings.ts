import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserRating = query({
    args: {
        eventId: v.id("events"),
        userId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {

        const event = await ctx.db.get(args.eventId);
        if (!event) {
            return { rating: 0 }; // Return 0 if the event doesn't exist
        }

        let userRating = event.ratings?.find((r) => r.userId === args.userId)?.rating ?? 0;

        return { rating: userRating ? userRating : 0 }; // Return the user's rating or 0 if not found
    },
});


export const getAverageRating = query({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            return { averageRating: 0, totalRatings: 0 }; // Return 0 if the event doesn't exist
        }

        const ratings = event.ratings || [];
        const averageRating =
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;

        return {
            averageRating,
            totalRatings: ratings.length,
        };
    },
});

export const submitRating = mutation({
    args: {
        eventId: v.id("events"),
        rating: v.number(),
        userId: v.id("users"),
    },

    handler: async (ctx, args) => {

        // Fetch the event from the database
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        // Initialize the ratings array if it doesn't exist
        const ratings = event.ratings || [];

        // Check if the user has already rated the event
        const existingRatingIndex = ratings.findIndex(
            (r) => r.userId === args.userId
        );

        if (existingRatingIndex !== -1) {
            // Update the existing rating
            ratings[existingRatingIndex].rating = Number(args.rating);
        } else {
            // Add the new rating to the ratings array
            ratings.push({
                userId: args.userId,
                rating: Number(args.rating),
            });
        }

        // Update the event with the new ratings array
        await ctx.db.patch(args.eventId, { ratings });

        // Calculate the new average rating
        const averageRating = ratings.reduce((total, r) => total + Number(r.rating), 0) / ratings.length;

        return {
            averageRating,
            totalRatings: ratings.length,
        };
    },
});