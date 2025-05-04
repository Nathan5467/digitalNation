"use client"

import { EventCreator } from "@/components/EventCreator"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import EventItem from "@/components/EventItem"
import { SetStateAction, useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Search, User } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Sort from "@/components/Sort"

export default function Events() {
  const events = useQuery(api.events.getEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortedEvents, setSortedEvents] = useState(events || [])
  const [sortOption, setSortOption] = useState("createTimeDesc")
  const [showUserEvents, setShowUserEvents] = useState(false)
  const currentUser = useQuery(api.users.getCurrentUser)

  // Handle sorting
  useEffect(() => {
    if (events) {
      let filteredEvents = [...events]

      // Filter by user-created events if toggle is on
      if (showUserEvents && currentUser) {
        filteredEvents = filteredEvents.filter((event) => {
          return (
            event.creatorId.split("|").pop() ===
            currentUser.tokenIdentifier.split("|")[1]
          )
        })
      }

      // Handle search
      if (searchTerm) {
        filteredEvents = filteredEvents.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Handle sorting
      switch (sortOption) {
        case "createTimeDesc":
          filteredEvents.sort((a, b) => b._creationTime - a._creationTime)
          break
        case "createTimeAsc":
          filteredEvents.sort((a, b) => a._creationTime - b._creationTime)
          break
        case "startTimeDesc":
          filteredEvents.sort((a, b) => {
            const dateA = new Date(a.date ?? 0).getTime()
            const dateB = new Date(b.date ?? 0).getTime()
            if (!dateA) return 1
            if (!dateB) return -1
            return dateB - dateA
          })
          break
        case "startTimeAsc":
          filteredEvents.sort((a, b) => {
            const dateA = new Date(a.date ?? 0).getTime()
            const dateB = new Date(b.date ?? 0).getTime()
            if (!dateA) return 1
            if (!dateB) return -1
            return dateA - dateB
          })
          break
        default:
          break
      }

      setSortedEvents(filteredEvents)
    }
  }, [events, sortOption, searchTerm, showUserEvents, currentUser])

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setSearchTerm(e.target.value)
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section aria-labelledby="events-section">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Events</h2>
          <EventCreator />
        </div>
        <div className="flex flex-col justify-items-start sm:flex-row sm:gap-5 sm:justify-between sm:items-center mb-8 gap-2">
          <div className="relative flex items-center">
            <Label htmlFor="search-events" className="sr-only hidden">
              Search events by name
            </Label>
            <Input
              id="search-events"
              type="text"
              placeholder="Search events by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border p-2 relative z-10 w-full sm:w-96"
              aria-label="Search events by name"
            />
            <Search
              className="w-4 h-4 absolute right-5 top-3 text-gray-500 z-20"
              aria-hidden="true"
            />
          </div>
          <div className="flex items-center gap-2">
            <Sort onSortChange={setSortOption} />

            {currentUser && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-user-events"
                  defaultChecked={showUserEvents}
                  checked={showUserEvents}
                  onCheckedChange={() => {
                    setShowUserEvents(!showUserEvents)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setShowUserEvents(!showUserEvents)
                    }
                  }}
                  aria-labelledby="label-show-user-events"
                />
                <Label
                  id="label-show-user-events"
                  htmlFor="only view my events"
                  className="text-gray-600 dark:text-gray-200"
                >
                  Only view my events
                </Label>
              </div>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3">
          {sortedEvents.map((event) => (
            <EventItem key={event._id} {...event} />
          ))}
        </div>
      </section>
    </>
  )
}
