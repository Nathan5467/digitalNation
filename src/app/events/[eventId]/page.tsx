"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { formatDate } from "@/lib/utils"
import { CalendarClock, MapPin, BadgeInfo, Star, Users } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "@/components/ui/use-toast"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import ParticipantsTable from "@/components/ParticipantsTable"
import { Separator } from "@/components/ui/separator"
import { debounce } from "lodash"
import RatingComponent from "@/components/RatingComponent"
import CommentsSection from "@/components/CommentsSection"

type EventPageProps = {
  params: {
    eventId: string
  }
}

type Event = {
  name: string
  date: string
  location: string
  description: string
  creatorId: Id<"users">
  link: string
  isContactPublic: boolean
}

type EventDetail = {
  event: Event
  isCreator: boolean
  hasJoined: boolean
  creator: {
    username: string
    email: string | undefined
    bio: string
    organization: string
  }
}

export default function EventPage({ params: { eventId } }: EventPageProps) {
  const toggleInterest = useMutation(api.events.toggleInterest)
  const updateEvent = useMutation(api.events.updateEvent)
  const deleteEvent = useMutation(api.events.deleteEvent)
  const participants = useQuery(api.events.getEventParticipants, {
    eventId: eventId as Id<"events">,
  })
  const router = useRouter()
  const currentUser = useQuery(api.users.getCurrentUser)
  const currentUserEmail = currentUser?.email

  const event = useQuery(api.events.getEventDetails, {
    eventId: eventId as Id<"events">,
  })
  const generalRating = useQuery(api.ratings.getAverageRating, {
    eventId: eventId as Id<"events">,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatedEvent, setUpdatedEvent] = useState<Omit<Event, "creatorId">>({
    name: "",
    date: "",
    location: "",
    description: "",
    link: "",
    isContactPublic: false,
  })

  if (!event || !event.event) {
    return (
      <div className="text-center py-20 text-gray-500">No event found.</div>
    )
  }

  const {
    event: { name, date, location, description, link, isContactPublic },
    isCreator,
    hasJoined,
    creator,
  } = event as unknown as EventDetail

  console.log("creator", creator)

  const handleToggleInterest = debounce(async () => {
    try {
      const result = await toggleInterest({ eventId: eventId as Id<"events"> })
      toast({
        title: "Success",
        description:
          result.action === "joined"
            ? "You have successfully shown interest in this event. Your contact information will be visible to the event organizers."
            : "You have successfully cancelled your interest in this event.",
        duration: 5000,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "You should login to show interest in this event",
        variant: "destructive",
        duration: 2000,
      })
    }
  }, 300)

  const handleEditEvent = () => {
    setUpdatedEvent({
      name,
      date,
      location,
      description,
      link,
      isContactPublic,
    })
    setIsEditing(true)
  }

  const handleSaveEvent = async () => {
    try {
      await updateEvent({
        eventId: eventId as Id<"events">,
        ...updatedEvent,
      })
      toast({
        title: "Success",
        description: "Event updated successfully",
        duration: 2000,
      })
      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent({ eventId: eventId as Id<"events"> })
      toast({
        title: "Success",
        description: "Event deleted successfully",
        duration: 2000,
      })
      router.push("/events")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  return (
    <div className="">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between w-full items-start">
        <h1 className="sm:text-3xl text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {name}
        </h1>
        {!isCreator && (
          <Button
            variant="outline"
            className="border border-gray-900 dark:border-gray-200"
            onClick={handleToggleInterest}
          >
            {hasJoined ? "Cancel Interest" : "Show Interest"}
          </Button>
        )}
        {isCreator && !isEditing && (
          <div className="flex justify-end items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handleEditEvent}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDialogOpen(true)}
            >
              Delete
            </Button>
          </div>
        )}
        {isCreator && isEditing && (
          <div className="flex justify-end items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEvent}>
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5 text-sm text-gray-600 dark:text-gray-200 ">
        {isCreator && isEditing ? (
          <>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={updatedEvent.name}
              onChange={(e) =>
                setUpdatedEvent({ ...updatedEvent, name: e.target.value })
              }
            />
            <Label htmlFor="date">Date(optional)</Label>
            <Input
              id="name"
              type="date"
              value={updatedEvent.date}
              onChange={(e) =>
                setUpdatedEvent({ ...updatedEvent, date: e.target.value })
              }
            />
            <Label htmlFor="date">Location(optional)</Label>

            <Input
              id="location"
              value={updatedEvent.location}
              onChange={(e) =>
                setUpdatedEvent({ ...updatedEvent, location: e.target.value })
              }
            />
            <Label htmlFor="date">Description</Label>

            <Textarea
              id="description"
              value={updatedEvent.description}
              onChange={(e) =>
                setUpdatedEvent({
                  ...updatedEvent,
                  description: e.target.value,
                })
              }
            />
            <Label htmlFor="date">Link(optional)</Label>
            <Input
              id="link"
              value={updatedEvent.link}
              onChange={(e) =>
                setUpdatedEvent({ ...updatedEvent, link: e.target.value })
              }
            />
            <div className="flex items-center">
              <Switch
                checked={updatedEvent.isContactPublic}
                onCheckedChange={(checked) =>
                  setUpdatedEvent({ ...updatedEvent, isContactPublic: checked })
                }
                aria-labelledby="isContactPublic-label"
              />
              <label
                id="isContactPublic-label"
                htmlFor="isContactPublic"
                className="ml-2"
              >
                Share your contact for this event?
              </label>
            </div>
          </>
        ) : (
          <div className="text-gray-600 dark:text-gray-200 flex flex-col gap-3">
            {creator && (
              <HoverCard>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div
                    className="flex gap-2 items-center underline hover:no-underline underline-offset-2 cursor-pointer"
                    aria-describedby="creator-info"
                  >
                    <BadgeInfo className="w-4 h-4" /> Event Creator:{" "}
                    {creator.username || ""}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent id="creator-info" className="w-80">
                  <div className="flex space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        @{creator.username}
                      </h4>
                      <p className="text-sm">
                        <strong>Email:</strong> {creator.email}
                      </p>
                      <p className="text-sm">
                        <strong>Bio:</strong> {creator.bio}
                      </p>
                      <p className="text-sm">
                        <strong>Organization:</strong> {creator.organization}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
            {!creator && <p>Created by: Anonymous</p>}
            {date && (
              <div className=" flex gap-2">
                <CalendarClock className="w-4 h-4" />
                {formatDate(date)}
              </div>
            )}
            {location && (
              <div className="  flex gap-2">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
            )}
            {link && (
              <div>
                Link:{" "}
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" underline underline-offset-2 hover:no-underline"
                >
                  {" "}
                  {link}
                </a>
              </div>
            )}
            <div>{description}</div>
          </div>
        )}

        <div className="flex justify-between items-center mb-2 ">
          <div className="flex flex-col text-gray-500 dark:text-gray-200">
            <span className="font-semibold">
              Credibility: {generalRating?.averageRating} / 5
            </span>
            <div className="flex gap-3">
              <Users className="w-5 h-5" />
              <span className="text-sm">
                Rated by {generalRating?.totalRatings} users
              </span>
            </div>
          </div>

          <RatingComponent
            title={"Your rating:"}
            eventId={eventId as Id<"events">}
            userId={currentUser?._id as Id<"users">}
          />
        </div>
        {isCreator && participants && (
          <>
            <Separator className="mt-4" />
            <h2 className="text-md font-semibold">Interested Users</h2>
            <ParticipantsTable
              participants={participants}
              creatorEmail={currentUserEmail}
              eventId={eventId}
            />
          </>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CommentsSection eventId={eventId} currentUser={currentUser} />
    </div>
  )
}
