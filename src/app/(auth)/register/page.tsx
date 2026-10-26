"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/lib/actions/auth"

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, null)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your family account</CardTitle>
        <CardDescription>Only parents sign up. You&apos;ll add your kids next.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" name="name" defaultValue={state?.values?.name} required minLength={2} autoComplete="name" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" defaultValue={state?.values?.email} type="email" required autoComplete="email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
            <p className="text-xs text-muted-foreground">At least 8 characters</p>
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
