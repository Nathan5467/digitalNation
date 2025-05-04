"use client"

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"
import { api } from "../../convex/_generated/api"
import { useQuery } from "convex/react"
import { Menu, TreePalm } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu"

export const Navbar = () => {
  let shownName = null
  const user = useUser()
  try {
    const currentUser = useQuery(api.users.getCurrentUser)
    if (currentUser?.username) {
      shownName = currentUser.username
    } else {
      shownName = user.user?.fullName ? user.user.fullName : ""
    }
  } catch (error) {
    console.log("error", error)
  }

  return (
    <header
      role="banner"
      className="border-b sticky top-0 left-0 right-0 bg-white py-3 z-40 dark:bg-black dark:text-white"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="homepage">
            <TreePalm className="w-6 h-6" />
          </Link>
          <Link href="/" className="font-medium text-lg hidden sm:block ">
            Ethical Digital Nation
          </Link>
        </div>
        <nav className="flex items-center gap-4" aria-label="Main Navigation">
          <div className=" sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="border-none"
                aria-label="Main Menu"
                tabIndex={0}
                // onKeyDown={handleKeyDown}
              >
                <Menu className="w-4 h-4 cursor-pointer" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="flex flex-col items-start"
                tabIndex={0}
              >
                <DropdownMenuItem asChild>
                  <Link href="/events" className="hover:underline" tabIndex={0}>
                    Events
                  </Link>
                </DropdownMenuItem>

                <SignedOut>
                  <DropdownMenuItem asChild>
                    <SignInButton>
                      <Button aria-label="Sign In" tabIndex={0}>
                        Sign In
                      </Button>
                    </SignInButton>
                  </DropdownMenuItem>
                </SignedOut>
                <SignedIn>
                  <DropdownMenuItem asChild>
                    <Link
                      tabIndex={0}
                      className="hover:underline"
                      href="/profile"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </SignedIn>
                <DropdownMenuItem asChild>
                  <DarkModeToggle />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/events" className="hover:underline" tabIndex={0}>
              Events
            </Link>
            <SignedOut>
              <SignInButton>
                <Button aria-label="Sign In" tabIndex={0}>
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link className="hover:underline" href="/profile" tabIndex={0}>
                Profile
              </Link>
              <UserButton aria-label="User Menu" />
            </SignedIn>
            <DarkModeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
