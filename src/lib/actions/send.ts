import "server-only"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ApiError, apiFetch } from "@/lib/api"
import type { ActionResult } from "./types"

export async function send(path: string, method: "POST" | "PUT" | "DELETE", fd?: FormData): Promise<ActionResult> {
  try {
    await apiFetch(path, { method, body: fd ? Object.fromEntries(fd) : undefined })
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
