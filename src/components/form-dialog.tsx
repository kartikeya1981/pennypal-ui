"use client"

import { startTransition, useActionState, useState } from "react"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ActionResult } from "@/lib/actions/types"

type Props = {
  title: string
  description?: string
  mode?: "add" | "edit"
  label?: string
  variant?: "default" | "outline"
  action: (fd: FormData) => Promise<ActionResult>
  children: React.ReactNode
  submitLabel?: string
}

export function FormDialog({
  title,
  description,
  mode = "add",
  label,
  variant = "default",
  action,
  children,
  submitLabel = "Save",
}: Props) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, fd: FormData) => {
      const res = await action(fd)
      if (res.ok) {
        setOpen(false)
        toast.success("Saved")
      }
      return res
    },
    null
  )

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger
        render={
          mode === "add" ? (
            <Button size="sm" variant={variant} />
          ) : (
            <Button variant="ghost" size="icon-sm" aria-label={title} />
          )
        }
      >
        {mode === "add" ? (
          <>
            <Plus />
            {label ?? "Add"}
          </>
        ) : (
          <Pencil />
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          // Submit via onSubmit rather than `action` so React doesn't reset the fields when the API rejects them.
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            startTransition(() => formAction(fd))
          }}
          className="grid gap-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">{children}</div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
