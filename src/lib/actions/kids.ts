"use server"

import { redirect } from "next/navigation"
import { send } from "./send"

export async function createKid(fd: FormData) {
  return send("/kids", "POST", fd)
}

export async function updateKid(id: string, fd: FormData) {
  return send(`/kids/${id}`, "PUT", fd)
}

export async function deleteKid(id: string) {
  const result = await send(`/kids/${id}`, "DELETE")
  if (!result.ok) throw new Error(result.error)
  redirect("/dashboard")
}
