"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setKidModePin } from "@/lib/actions/settings"

export function KidModePinForm({ hasPin }: { hasPin: boolean }) {
  const [state, action, pending] = useActionState(setKidModePin, null)
  const form = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (state?.ok) {
      toast.success("Kid Mode PIN saved")
      form.current?.reset()
    }
  }, [state])
  return (
    <form ref={form} action={action} className="grid gap-4">
      <PinFields newPin={hasPin} />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : hasPin ? "Change PIN" : "Set PIN"}
        </Button>
      </div>
    </form>
  )
}

/** A 4-digit PIN plus the account password (needed to set or change the PIN). */
export function PinFields({ newPin = false }: { newPin?: boolean }) {
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="kid-pin">{newPin ? "New 4-digit PIN" : "4-digit PIN"}</Label>
        <Input id="kid-pin" name="pin" type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} autoComplete="off" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="kid-pin-password">Your account password</Label>
        <Input id="kid-pin-password" name="password" type="password" autoComplete="current-password" required />
      </div>
    </>
  )
}
