import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DownloadIcon, EllipsisVertical } from "lucide-react"

import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { Doc } from "../../convex/_generated/dataModel"
import { api } from "../../convex/_generated/api"
import { useToast } from "./ui/use-toast"

export const FileCardActions = ({ file }: { file: Doc<"files"> }) => {
  const deleteFile = useMutation(api.files.deleteFile)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const { toast } = useToast()
  const fileUrl = useQuery(api.files.getFileUrl, {
    fileId: file._id,
  })

  return (
    <>
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to delete this file?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                })
                toast({
                  title: "File deleted",
                  description: "The file has been deleted successfully.",
                  duration: 2000,
                })
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              if (fileUrl) {
                window.open(fileUrl, "_blank")
              }
            }}
          >
            <DownloadIcon className="w-4 r-4 mr-1" /> DownLoad
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" text-red-500 cursor-pointer "
            onClick={() => setDeleteAlertOpen(true)}
          >
            <Trash2 className="w-4 r-4 mr-1" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const FileCard = ({ file }: { file: Doc<"files"> }) => {
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="sm:text-xl text-md">{file.title}</CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions file={file} />
        </div>
      </CardHeader>

      <CardContent>
        <p>{file.description}</p>
      </CardContent>
    </Card>
  )
}
