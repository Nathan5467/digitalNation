import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex items-center justify-center  max-w-2xl mx-auto">
      <SignIn />
    </div>
  )
}
