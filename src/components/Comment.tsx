import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

import { formatDistanceToNow } from "date-fns"
import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { api } from "../../convex/_generated/api"

type CommentProp = {
  comment: any
  replies: any[]
  onReply: (parentId: string, content: string) => void
  onDelete: (commentId: string) => void
  currentUser: any
}

// 单个评论组件，显示评论内容及其子评论，并支持回复功能
const Comment = ({
  comment,
  replies,
  onReply,
  onDelete,
  currentUser,
}: CommentProp) => {
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleReply = () => {
    onReply(comment._id, replyContent)
    setReplyContent("")
    setIsReplying(false)
  }

  const handleCancelReply = () => {
    setReplyContent("")
    setIsReplying(false)
  }

  const deleteComment = useMutation(api.comments.deleteComment)

  const handleDelete = async () => {
    await deleteComment({ commentId: comment._id, userId: currentUser._id })
    onDelete(comment._id)
    setIsDialogOpen(false)
  }

  return (
    <div className="comment mb-4">
      <div className="flex items-center gap-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="font-semibold cursor-pointer underline hover:no-underline">
              {comment.user?.username || "Unknown User"}
            </span>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex flex-col space-y-1">
              <h4 className="text-sm font-semibold">
                @{comment.user?.username}
              </h4>
              <p className="text-sm">
                <strong>Email: </strong> {comment.user?.email}
              </p>
              <p className="text-sm">
                <strong>Bio: </strong> {comment.user?.bio}
              </p>
              <p className="text-sm">
                <strong>Organization: </strong> {comment.user?.organization}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
        <span className="text-gray-500 text-sm">
          {formatDistanceToNow(new Date(comment.createdAt))} ago
        </span>
        {/* delete comment */}
        {currentUser && currentUser._id === comment.userId && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Delete </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this comment ? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button variant="destructive" onClick={handleDelete}>
                    Yes, Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
      <p className="mt-2"> {comment.content} </p>
      <div className="flex gap-2">
        <Button
          className="text-blue-700 dark:text-blue-300 p-0"
          variant="link"
          onClick={() => setIsReplying(!isReplying)}
        >
          Reply
        </Button>
      </div>

      {isReplying && (
        <div className="mt-2">
          <div className="flex flex-col gap-2 justify-end items-start">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-grow"
            />
            <div className="flex gap-2">
              {" "}
              <Button variant="outline" onClick={handleCancelReply}>
                Cancel
              </Button>
              <Button onClick={handleReply} className="self-end sm:self-auto">
                Submit
              </Button>{" "}
            </div>
          </div>
        </div>
      )}

      {replies && replies.length > 0 && (
        <div className="replies ml-4 mt-4">
          {replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              replies={reply.replies}
              onReply={onReply}
              currentUser={currentUser}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment
