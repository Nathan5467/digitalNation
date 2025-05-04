import React, { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Id } from "../../convex/_generated/dataModel"

import { Separator } from "./ui/separator"
import Comment from "./Comment"
import { toast } from "./ui/use-toast"

type CommentSectionProps = {
  eventId: string
  currentUser: any
}

// 评论区组件，用于展示评论列表并允许用户发表评论或回复
const CommentsSection = ({ eventId, currentUser }: CommentSectionProps) => {
  const [newCommentContent, setNewCommentContent] = useState("")
  const queryComment = useQuery(api.comments.getComments, {
    eventId: eventId as Id<"events">,
  })
  const [comments, setComments] = useState<any[]>([])
  console.log("comments", comments)

  useEffect(() => {
    if (queryComment) {
      setComments(queryComment)
    }
  }, [queryComment])

  // 使用 useMutation 创建新的评论
  const createComment = useMutation(api.comments.createComment)

  const handleNewComment = async () => {
    if (!newCommentContent.trim()) {
      return toast({
        description: "Comment content is required",
      })
    }
    try {
      await createComment({
        eventId: eventId as Id<"events">,
        userId: currentUser._id,
        content: newCommentContent,
      })
      setNewCommentContent("")
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please login to comment",
      })
    }
  }

  const handleReply = async (parentId: any, content: string) => {
    if (!content.trim()) return
    try {
      await createComment({
        eventId: eventId as Id<"events">,
        userId: currentUser._id,
        parentId,
        content,
      })
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please login to reply",
      })
    }
  }
  const handleDelete = (commentId: string) => {
    setComments((comments ?? []).filter((comment) => comment._id !== commentId))
  }

  return (
    <div className="comments-section mt-8">
      <h2 className="font-semibold mb-2">Comments</h2>

      <div className="new-comment flex flex-col gap-2 justify-end items-start">
        <Textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button className="self-end sm:self-auto" onClick={handleNewComment}>
          Submit
        </Button>
      </div>

      <Separator className="my-3" />

      {comments &&
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            replies={comment.replies}
            onReply={handleReply}
            onDelete={handleDelete}
            currentUser={currentUser}
          />
        ))}
    </div>
  )
}

export default CommentsSection
