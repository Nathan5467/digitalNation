"use client"

import { useUser, SignOutButton } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { useState, useEffect } from "react"
import { api } from "../../../convex/_generated/api"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { roleMapping } from "@/lib/const"

const Profile = () => {
  const { user, isLoaded } = useUser()
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const [organization, setOrganization] = useState("")
  const [bio, setBio] = useState("")
  const [researchInterests, setResearchInterests] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const updateUserProfile = useMutation(api.users.updateUserProfile)

  const currentUser = useQuery(api.users.getCurrentUser)

  useEffect(() => {
    if (isLoaded && user && currentUser) {
      setUsername(currentUser.username || user.username || "")
      setRole(currentUser.role || "")
      setOrganization(currentUser.organization || "")
      setBio(currentUser.bio || "")
      setResearchInterests(currentUser.researchInterests || "")

      if (
        !currentUser.username &&
        !currentUser.role &&
        !currentUser.organization &&
        !currentUser.bio &&
        !currentUser.researchInterests
      ) {
        setIsEditing(true)
      }
    }
  }, [isLoaded, user, currentUser])

  const handleSave = async () => {
    if (!username || !username.trim()) {
      toast({
        title: "Error",
        description: "Username is required",
        variant: "destructive",
        duration: 2000,
      })
      return
    }
    const res = await updateUserProfile({
      username,
      role,
      organization,
      bio,
      researchInterests,
    })
    if (res.status === "success") {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        duration: 2000,
      })
      setIsEditing(false) // 保存后退出编辑模式
    }
  }

  if (!isLoaded || !user) {
    return <div>Loading...</div>
  }

  return (
    <div
      className="max-w-5xl mx-auto"
      role="main"
      aria-labelledby="profile-heading"
    >
      <h1 id="profile-heading" className="text-2xl font-bold mb-4">
        Profile
      </h1>
      {isEditing ? (
        <>
          <div className="mb-4">
            <Label htmlFor="username">Username:</Label>
            <Input
              id="username"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="role">Role:</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value)}
              aria-labelledby="role-label"
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="professional_services">
                  Professional Services
                </SelectItem>
                <SelectItem value="faculty_member">Faculty Member</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="organization">Organization:</Label>
            <Input
              id="organization"
              type="text"
              value={organization}
              placeholder="Organization"
              onChange={(e) => setOrganization(e.target.value)}
              aria-required="false"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="bio">Bio:</Label>
            <Textarea
              id="bio"
              value={bio}
              placeholder="Bio"
              onChange={(e) => setBio(e.target.value)}
              aria-required="false"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="researchInterests">Research Interests:</Label>
            <Textarea
              id="researchInterests"
              value={researchInterests}
              placeholder="Research Interests"
              onChange={(e) => setResearchInterests(e.target.value)}
              aria-required="false"
            />
          </div>
          <div className="flex justify-start gap-2 items-center">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <Label className="font-semibold">Username:</Label>
            <p>{username}</p>
          </div>
          <div className="mb-4">
            <Label className="font-semibold">Role:</Label>
            <p>{roleMapping[role]}</p>
          </div>
          <div className="mb-4">
            <Label className="font-semibold">Organization:</Label>
            <p>{organization}</p>
          </div>
          <div className="mb-4">
            <Label className="font-semibold">Bio:</Label>
            <p>{bio}</p>
          </div>
          <div className="mb-4">
            <Label className="font-semibold">Research Interests:</Label>
            <p>{researchInterests}</p>
          </div>
          <div className="flex justify-between items-center">
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </div>
        </>
      )}
    </div>
  )
}

export default Profile
