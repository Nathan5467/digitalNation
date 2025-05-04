"use client"

import React, { useState, useRef, useEffect } from "react"
import ReactDOMServer from "react-dom/server"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "./DataTable"
import { useToast } from "./ui/use-toast"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import ParticipantsEmail from "./email-template"
import { Input } from "./ui/input"
import { roleMapping } from "@/lib/const"

type Participant = {
  _id: string & {
    __tableName: "users"
  }
  _creationTime: number
  name?: string | undefined
  image?: any
  username?: string | undefined
  role?: string | undefined
  organization?: string | undefined
  bio?: string | undefined
  researchInterests?: string | undefined
  email?: string | undefined
  tokenIdentifier: string
} | null

export type Participants = Participant[]

const ParticipantsTable = ({
  participants,
  creatorEmail,
  eventId,
}: {
  participants: any | Participants
  creatorEmail: string | undefined
  eventId: string
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [emailContent, setEmailContent] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const { toast } = useToast()
  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    <ParticipantsEmail
      eventUrl={`https://ethical-digital-nation.vercel.app/events/${eventId}`}
      content={emailContent}
    />
  )
  const sendEmailButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (selectedRows.length > 0 && sendEmailButtonRef.current) {
      sendEmailButtonRef.current.focus() // 当按钮启用时，将焦点设置到按钮上
    }
  }, [selectedRows]) // 监听selectedRows的变化

  function handleSubmit(e: any) {
    e.preventDefault()
    const postData = async () => {
      if (!emailContent.trim()) {
        toast({
          title: "Error",
          description: "Email content cannot be empty.",
          variant: "destructive",
        })
        return
      }

      const selectedParticipants = participants.filter(
        (participant: Participant) => selectedRows.includes(participant?._id!)
      )

      const emailAddresses = selectedParticipants
        .map((p: Participant) => p?.email)
        .filter(Boolean)

      if (emailAddresses.length === 0) {
        toast({
          title: "Error",
          description: "No valid email addresses selected.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/send-emails", {
        method: "POST",
        body: JSON.stringify({
          to: emailAddresses,
          replyTo: creatorEmail,
          subject: emailSubject,
          text: emailContent,
          eventUrl: `https://ethical-digital-nation.vercel.app/events/${eventId}`,
          from: "ethical-digital-nation@joy-yujiepeng.xyz", // TODO: change to verified email address later
        }),
      })
      return response.json()
    }
    postData().then((data) => {
      toast({
        title: "Success",
        description: "Emails sent successfully.",
      })
    })
  }

  const handleSelectAll = () => {
    if (selectedRows.length === participants?.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(participants.map((p: Participant) => p?._id!))
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const columns: ColumnDef<Participant>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSelectAll()
            }
          }}
          checked={selectedRows.length === participants.length}
          onCheckedChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSelectRow(row.original?._id!)
              }
            }}
            checked={selectedRows.includes(row.original?._id!)}
            onCheckedChange={() => {
              handleSelectRow(row.original?._id!)
            }}
          />
        )
      },
    },
    {
      id: "name",
      header: "Full Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.original?.name}</span>
        </div>
      ),
    },
    { id: "username", header: "Username", accessorKey: "username" },
    { id: "email", header: "Email", accessorKey: "email" },
    { id: "organization", header: "Organization", accessorKey: "organization" },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => (
        <span>
          {row?.original?.role ? roleMapping[row.original?.role] : ""}
        </span>
      ),
    },
    {
      id: "researchInterests",
      header: "Research Interests",
      accessorKey: "researchInterests",
    },
  ]

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          disabled={selectedRows.length === 0}
          ref={sendEmailButtonRef}
        >
          Send Email
        </Button>
      </div>
      <DataTable columns={columns} data={participants} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write your email to the participants</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter the subject here..."
            value={emailSubject}
            onChange={(e) => {
              setEmailSubject(e.target.value)
            }}
          />
          <Textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Enter the email content..."
          />
          <div className="mt-4">
            <h3 className="font-bold">Preview:</h3>
            <div
              className="border border-gray-300 p-4 rounded max-h-[300px] overflow-y-auto mt-3 text-sm"
              dangerouslySetInnerHTML={{ __html: emailHtml }}
              style={{ whiteSpace: "normal" }} // 使HTML内容正常渲染
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {/* <form > */}
            <Button type="submit" onClick={handleSubmit}>
              Confirm Send
            </Button>
            {/* </form> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ParticipantsTable
