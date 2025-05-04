"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { CalendarClock, MapPin } from "lucide-react"

import { useRouter } from "next/navigation"

export default function EventItem({
  name,
  description,
  date,
  location,
  _id,
  creator,
}: {
  name: string
  description: string
  date?: string
  location?: string
  _id: string
  creator?: string
}) {
  const router = useRouter()
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      router.push(`/events/${_id}`)
    }
  }
  return (
    <Card
      className="group hover:shadow-md cursor-pointer rounded-lg overflow-hidden"
      onClick={() => {
        router.push(`/events/${_id}`)
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <CardHeader className="relative">
        <CardTitle className="group-hover:text-pink-600 sm:text-lg text-md  ">
          {name}
        </CardTitle>
        <div className="text-gray-600 dark:text-gray-300 text-xs flex flex-col gap-2">
          {location && (
            <div className="  flex gap-2 items-center">
              <MapPin className="w-4 h-4" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {location}
              </span>
            </div>
          )}
          {date && (
            <div className=" flex gap-2 items-center">
              <CalendarClock className="w-4 h-4" />
              {formatDate(date)}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative max-h-24 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-100% dark:from-gray-900 z-10"></div>
        <p className="text-xs">{description}</p>
      </CardContent>
    </Card>
  )
}
