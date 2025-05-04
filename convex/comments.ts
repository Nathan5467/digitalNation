import { GenericId, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 创建评论
export const createComment = mutation({
    args: {
        eventId: v.id("events"),
        userId: v.id("users"),
        parentId: v.optional(v.id("comments")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const { eventId, userId, parentId, content } = args;
        if (!userId) {
            throw new Error("Unauthorized");
        }
        // 创建评论
        const commentId = await ctx.db.insert("comments", {
            eventId,
            userId,
            parentId,
            content,
            createdAt: Date.now(),
        });

        return commentId;
    },
});

// 获取评论
export const getComments = query({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const { eventId } = args;

        // get top level comments
        const topLevelComments = await ctx.db
            .query("comments")
            .filter((q) => q.eq(q.field("eventId"), eventId))
            .filter((q) => q.or(
                q.eq(q.field("parentId"), null),
                q.eq(q.field("parentId"), undefined)
            ))
            .collect();

        // get all related user information
        const userIds = topLevelComments.map(comment => comment.userId);
        const users = await Promise.all(userIds.map(userId => ctx.db.get(userId)));

        // construct user information dictionary
        const userDict: Record<string, typeof users[0]> = users.reduce((dict, user) => {
            if (user !== null) {
                dict[user._id] = user;
            }
            return dict;
        }, {} as Record<string, typeof users[0]>);

        // get replies of a comment
        const getReplies = async (commentId: GenericId<"comments">): Promise<any> => {
            const replies = await ctx.db
                .query("comments")
                .filter((q) => q.eq(q.field("parentId"), commentId))
                .collect();

            // get all related user information
            const replyUserIds = replies.map(reply => reply.userId);
            const replyUsers = await Promise.all(replyUserIds.map(userId => ctx.db.get(userId)));

            // build user information dictionary
            replyUsers.forEach(user => {
                if (user !== null) {
                    userDict[user._id] = user;
                }
            });

            // recursively get replies of replies
            return await Promise.all(
                replies.map(async (reply) => ({
                    ...reply,
                    user: userDict[reply.userId], // 附加用户信息
                    replies: await getReplies(reply._id),
                }))
            );
        };

        // get replies of top level comments
        const res = await Promise.all(
            topLevelComments.map(async (comment) => ({
                ...comment,
                user: userDict[comment.userId], // 附加用户信息
                replies: await getReplies(comment._id),
            }))
        );

        return res;
    },
});


export const deleteComment = mutation({
    args: {
        commentId: v.id("comments"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const { commentId, userId } = args;

        // 获取评论
        const comment = await ctx.db.get(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }

        // 确认当前用户是评论的创建者
        if (comment.userId !== userId) {
            throw new Error("Unauthorized");
        }

        // 删除评论
        await ctx.db.delete(commentId);

        // 递归删除子评论
        const deleteReplies = async (parentId: GenericId<"comments">) => {
            const replies = await ctx.db
                .query("comments")
                .filter((q) => q.eq(q.field("parentId"), parentId))
                .collect();

            for (const reply of replies) {
                await ctx.db.delete(reply._id);
                await deleteReplies(reply._id);
            }
        };

        await deleteReplies(commentId);
    },
});
