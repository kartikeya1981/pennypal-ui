"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { KID_MODE_COOKIE } from "@/lib/cookies"
import { send } from "./send"
import type { ActionResult } from "./types"

/** Hands the device to the kid. Sets the PIN first when the form includes one (first time only). */
export async function enterKidMode(kidId: string, fd: FormData): Promise<ActionResult> {
  if (fd.has("pin")) {
    const result = await send("/me/kid-mode-pin", "PUT", fd)
    if (!result.ok) return result
  }
  ;(await cookies()).set(KID_MODE_COOKIE, kidId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  })
  redirect("/kid")
}

export async function exitKidMode(fd: FormData): Promise<ActionResult> {
  const jar = await cookies()
  const kidId = jar.get(KID_MODE_COOKIE)?.value
  const result = await send("/me/kid-mode/unlock", "POST", { pin: String(fd.get("pin") ?? "") })
  if (!result.ok) return result
  jar.delete(KID_MODE_COOKIE)
  redirect(kidId ? `/kids/${kidId}` : "/dashboard")
}
