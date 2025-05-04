import React, { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { toast } from "@/components/ui/use-toast"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"
import { Star } from "lucide-react"

const RatingComponent = ({
  eventId,
  userId,
  className,
  title,
}: {
  eventId: Id<"events">
  userId?: Id<"users">
  className?: string
  title?: string
}) => {
  const [userRating, setUserRating] = useState(0)
  const [hover, setHover] = useState(0)
  const submitRating = useMutation(api.ratings.submitRating)

  // Fetch user's rating on component mount
  const userRatingsRes = useQuery(api.ratings.getUserRating, {
    eventId,
    userId,
  })

  useEffect(() => {
    if (userRatingsRes?.rating) {
      setUserRating(userRatingsRes.rating)
    }
  }, [userRatingsRes])

  const handleRatingSubmit = async (ratingValue: number) => {
    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "Please login to submit rating",
          variant: "destructive",
          duration: 2000,
        })
        return
      }
      const res = await submitRating({ eventId, rating: ratingValue, userId })
      setUserRating(ratingValue)
      toast({
        title: "Success",
        description: "Your rating has been submitted",
        duration: 2000,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, ratingValue: number) => {
    if (event.key === "Enter") {
      handleRatingSubmit(ratingValue)
    }
  }
  return (
    <div className="flex flex-col gap-1">
      <div>{title}</div>
      <div className={`flex gap-1 ${className}`}>
        {Array.from({ length: 5 }, (star, i) => {
          const ratingValue = i + 1
          return (
            <label key={i}>
              <input
                className="hidden"
                type="radio"
                value={ratingValue}
                onClick={() => {
                  handleRatingSubmit(ratingValue)
                }}
              />
              <Star
                tabIndex={0}
                className="w-4 h-4 cursor-pointer "
                fill={ratingValue <= (hover || userRating) ? "#FFD700" : "none"}
                strokeWidth={1}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                onKeyDown={(event) => handleKeyDown(event, ratingValue)}
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default RatingComponent
