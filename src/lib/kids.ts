import "server-only"
import { notFound } from "next/navigation"
import { ApiError, api } from "@/lib/api"
import type { Kid } from "@/lib/types"

export async function getKidOr404(id: string) {
  try {
    return await api<Kid>(`/kids/${id}`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound()
    throw e
  }
}
