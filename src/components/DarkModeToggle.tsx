import { Moon, Sun } from "lucide-react"
import { forwardRef } from "react"
import { useTheme } from "@/contexts/themeContext"

const DarkModeToggle = forwardRef<HTMLButtonElement>((props, ref) => {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      aria-label="Toggle dark mode"
      tabIndex={0}
      ref={ref} // Use the forwarded ref here
      className="dark:text-slate-500 cursor-pointer"
      onClick={() => {
        toggleTheme()
      }}
      {...props} // Spread any additional props (important for asChild)
    >
      {theme == "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  )
})

// Adding displayName for debugging purposes
DarkModeToggle.displayName = "DarkModeToggle"

export default DarkModeToggle
