import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createEvent = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        date: v.string() || undefined,
        location: v.string() || undefined,
        link: v.string() || undefined,
        isContactPublic: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('not authenticated')
        }
        return ctx.db.insert('events', {
            name: args.name,
            description: args.description,
            date: args.date,
            location: args.location,
            creatorId: identity.tokenIdentifier,
            link: args.link,
            isContactPublic: args.isContactPublic
        })
    }
})

export const getEvents = query({
    async handler(ctx) {
        return ctx.db.query('events').collect()
    }
})


export const getEventDetails = query({
    args: {
        eventId: v.id("events"),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        let user: any
        let creator = null
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            return { error: "event_not_found" };
        }
        if (identity) {
            // 确认 tokenIdentifier 包含正确的前缀
            const tokenIdentifier = identity.tokenIdentifier.startsWith("https://undefined|")
                ? identity.tokenIdentifier
                : `https://undefined|${identity.tokenIdentifier.split("|")[1]}`;

            user = await ctx.db.query("users")
                .filter(q => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
                .first();

            if (!user) {
                return { error: "user_not_found" };
            }

            const isCreator = event.creatorId.split("|")[1] === user.tokenIdentifier.split("|")[1];
            const creatorIdentifier = event.creatorId.startsWith("https://undefined|") ? event.creatorId : `https://undefined|${event.creatorId.split("|")[1]}`;
            creator = await ctx.db.query("users")
                .filter(q => q.eq(q.field("tokenIdentifier"), creatorIdentifier))
                .first();

            const participants = await ctx.db.query("event_participants")
                .filter(q => q.eq(q.field("eventId"), args.eventId))
                .collect();

            const hasJoined = participants.some((participant: any) => {
                return participant.userId === user._id
            });

            return {
                event,
                isCreator,
                hasJoined,
                creator: event.isContactPublic ? creator : null // 根据是否公开返回创建者信息
            };
        }

        return {
            event,
            isCreator: null,
            hasJoined: null,
            creator: event.isContactPublic ? creator : null // 根据是否公开返回创建者信息
        }
    }
});


export const toggleInterest = mutation({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error("not authenticated")
        }

        const tokenIdentifier = identity.tokenIdentifier.startsWith("https://undefined|")
            ? identity.tokenIdentifier
            : `https://undefined|${identity.tokenIdentifier.split("|")[1]}`

        const user = await ctx.db.query("users")
            .filter(q => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
            .first()

        if (!user) {
            throw new Error("User not found")
        }

        const existingParticipant = await ctx.db.query("event_participants")
            .filter(q => q.and(q.eq(q.field("userId"), user._id), q.eq(q.field("eventId"), args.eventId)))
            .first()

        if (existingParticipant) {
            await ctx.db.delete(existingParticipant._id)
            return { action: "unjoined" }
        } else {
            await ctx.db.insert("event_participants", {
                userId: user._id,
                eventId: args.eventId,
            })
            return { action: "joined" }
        }
    },
})

export const getEventParticipants = query({
    args: {
        eventId: v.id("events"),
    },
    async handler(ctx, args) {
        const participants = await ctx.db.query("event_participants")
            .filter(q => q.eq(q.field("eventId"), args.eventId))
            .collect();

        if (participants.length === 0) {
            return { participants: [] };
        }

        const userIds = participants.map(p => p.userId);

        const users = await Promise.all(userIds.map(userId => ctx.db.get(userId)));

        return users;
    }
});

export const updateEvent = mutation({
    args: {
        eventId: v.id("events"),
        name: v.string(),
        description: v.string(),
        date: v.string(),
        location: v.string(),
        link: v.string(),
        isContactPublic: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('not authenticated')
        }

        const event = await ctx.db.get(args.eventId)
        if (!event) {
            throw new Error('Event not found')
        }

        if (event.creatorId !== identity.tokenIdentifier) {
            throw new Error('You do not have permission to edit this event')
        }

        await ctx.db.patch(args.eventId, {
            name: args.name,
            description: args.description,
            date: args.date,
            location: args.location,
            link: args.link,
            isContactPublic: args.isContactPublic,
        })
    }
})

export const deleteEvent = mutation({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('not authenticated')
        }

        const event = await ctx.db.get(args.eventId)
        if (!event) {
            throw new Error('Event not found')
        }

        if (event.creatorId !== identity.tokenIdentifier) {
            throw new Error('You do not have permission to delete this event')
        }

        await ctx.db.delete(args.eventId)
    }
})

export const searchEventsByName = query({
    args: {
        name: v.string(),
    },
    async handler(ctx, args) {
        return ctx.db.query("events")
            .withSearchIndex("search_name", q => q.search("name", args.name))
            .collect();
    }
});