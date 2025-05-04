"use client"
import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

type SortComponentType = {
  onSortChange: (value: string) => void
}

const sortTermDict: Record<string, string> = {
  createTimeDesc: "Creation Time (New to Old)",
  createTimeAsc: "Creation Time (Old to New)",
  startTimeDesc: "Start Time (New to Old)",
  startTimeAsc: "Start Time (Old to New)",
} as const

// Sort component
const Sort = ({ onSortChange }: SortComponentType) => {
  const handleSortChange = (value: string) => {
    onSortChange(value)
    setSortTerm(sortTermDict[value])
  }

  const [sortTerm, setSortTerm] = useState("Creation Time (New to Old)")

  return (
    <Select onValueChange={handleSortChange} aria-label="Sort by creation time">
      <SelectTrigger aria-label="Sort by creation time">
        {sortTerm}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createTimeDesc">
          Creation Time (New to Old)
        </SelectItem>
        <SelectItem value="createTimeAsc">
          Creation Time (Old to New)
        </SelectItem>
        <SelectItem value="startTimeDesc">Start Time (New to Old)</SelectItem>
        <SelectItem value="startTimeAsc">Start Time (Old to New)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default Sort
