import "server-only"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ApiError, apiFetch } from "@/lib/api"
import { KID_MODE_COOKIE } from "@/lib/cookies"
import { kidModeApiAllowed } from "@/lib/kid-mode"
import type { ActionResult } from "./types"

export async function send(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: FormData | Record<string, unknown>
): Promise<ActionResult> {
  if ((await cookies()).has(KID_MODE_COOKIE) && !kidModeApiAllowed(method, path)) {
    return { ok: false, error: "Ask a grown-up to leave Kid Mode first" }
  }
  try {
    await apiFetch(path, { method, body: body instanceof FormData ? Object.fromEntries(body) : body })
  } catch (e) {
    if (!(e instanceof ApiError)) throw e
    if (e.status === 401) redirect("/login")
    return { ok: false, error: e.message }
  }
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function remove(path: string): Promise<void> {
  const result = await send(path, "DELETE")
  if (!result.ok) throw new Error(result.error)
}
