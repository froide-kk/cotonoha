"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Strikethrough, List } from "lucide-react"

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const [selection, setSelection] = useState<{
    start: number
    end: number
  } | null>(null)

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    })
  }

  const applyFormat = (format: string) => {
    if (!selection) return

    let prefix = ""
    let suffix = ""

    switch (format) {
      case "bold":
        prefix = "**"
        suffix = "**"
        break
      case "italic":
        prefix = "_"
        suffix = "_"
        break
      case "strikethrough":
        prefix = "~~"
        suffix = "~~"
        break
      case "list":
        prefix = "- "
        suffix = ""
        break
      default:
        return
    }

    const selectedText = value.substring(selection.start, selection.end)
    const newText =
      value.substring(0, selection.start) + prefix + selectedText + suffix + value.substring(selection.end)

    onChange(newText)
  }

  return (
    <div className="space-y-2">
      <ToggleGroup type="multiple" className="justify-start">
        <ToggleGroupItem value="bold" aria-label="太字" onClick={() => applyFormat("bold")}>
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="斜体" onClick={() => applyFormat("italic")}>
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="strikethrough" aria-label="打ち消し線" onClick={() => applyFormat("strikethrough")}>
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="リスト" onClick={() => applyFormat("list")}>
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleTextareaSelect}
        placeholder="本文を入力してください"
        className="min-h-[200px]"
      />
    </div>
  )
}

