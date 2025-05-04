import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex items-center justify-center  mt-12 max-w-2xl mx-auto">
      <SignUp />
    </div>
  )
}
