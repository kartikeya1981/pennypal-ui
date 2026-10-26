"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DeleteButton({
  action,
  label = "this item",
}: {
  action: () => Promise<void>
  label?: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete ${label}?`)) e.preventDefault()
      }}
    >
      <Button type="submit" variant="ghost" size="icon-sm" aria-label={`Delete ${label}`}>
        <Trash2 className="text-destructive" />
      </Button>
    </form>
  )
}
