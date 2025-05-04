import React, { useState } from "react"
import { X } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

const TagInput = () => {
  const [tags, setTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      setTags([...tags, inputValue])
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter tags and press Enter"
      />
      <div className="flex flex-wrap mt-2">
        {tags.map((tag, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="mr-2 mb-2"
            onClick={() => removeTag(index)}
          >
            {tag} <X className="ml-1 h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  )
}

export default TagInput
