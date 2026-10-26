"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ApiError, apiFetch, TOKEN_COOKIE } from "@/lib/api"

export type AuthState = { error?: string; values?: Record<string, string> } | null

async function authenticate(path: "/auth/login" | "/auth/register", fd: FormData): Promise<AuthState> {
  let token: string
  try {
    ;({ token } = await apiFetch<{ token: string }>(path, { method: "POST", body: Object.fromEntries(fd), token: null }))
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message, values: { name: String(fd.get("name") ?? ""), email: String(fd.get("email") ?? "") } }
    throw e
  }
  ;(await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  })
  redirect("/dashboard")
}

export async function login(_prev: AuthState, fd: FormData): Promise<AuthState> {
  return authenticate("/auth/login", fd)
}

export async function register(_prev: AuthState, fd: FormData): Promise<AuthState> {
  return authenticate("/auth/register", fd)
}

export async function logout() {
  ;(await cookies()).delete(TOKEN_COOKIE)
  redirect("/")
}
