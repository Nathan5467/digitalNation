"use client"

import { z } from "zod"
import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useConvexAuth, useMutation, useQuery } from "convex/react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"
import { Loader2, PencilLine } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { api } from "../../convex/_generated/api"
import { toast } from "./ui/use-toast"
import { Switch } from "./ui/switch"
import TagInput from "./TagInput"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(2).max(1000),
  date: z.optional(z.string()),
  location: z.optional(z.string()),
  link: z.optional(z.string()),
  isContactPublic: z.boolean(),
})

export const EventCreator = () => {
  const { isAuthenticated } = useConvexAuth()
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      location: "",
      link: "",
      isContactPublic: false,
    },
  })
  const abortControllerRef = useRef<AbortController | null>(null)
  const createEvent = useMutation(api.events.createEvent)

  async function onSubmit(value: z.infer<typeof formSchema>) {
    try {
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current

      await createEvent(value as any)

      toast({
        title: "Event created",
        description: "The event has been created successfully.",
        duration: 2000,
      })
      form.reset()
      setIsCreateEventOpen(false)
    } catch (error: any) {
      toast({
        title: "Failed to create event",
        description: error.message,
        duration: 5000,
      })
    }
  }

  return (
    <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            if (!isAuthenticated) {
              toast({
                title: "Sign in required",
                description: "You need to sign in to create an event.",
                duration: 3000,
              })
            } else {
              setIsCreateEventOpen(true)
            }
          }}
        >
          <PencilLine className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8 font-medium">Create event</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link(optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date(optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location(optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isContactPublic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make your contact public?</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <TagInput /> */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex gap-2"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
