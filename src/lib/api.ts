import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { TOKEN_COOKIE } from "./cookies"

export { TOKEN_COOKIE }
const API_URL = (process.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "")
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  query?: Record<string, string | undefined>
  /** Pass null to send the request without the signed-in user's token. */
  token?: string | null
}

export async function apiFetch<T>(path: string, { method = "GET", body, query, token }: Options = {}): Promise<T> {
  const authToken = token === undefined ? (await cookies()).get(TOKEN_COOKIE)?.value : token
  const params = new URLSearchParams(
    Object.entries(query ?? {}).filter((e): e is [string, string] => e[1] !== undefined)
  ).toString()
  const res = await fetch(`${API_URL}${path}${params ? `?${params}` : ""}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  })
  const text = await res.text()
  const data = text ? JSON.parse(text, (_k, v) => (typeof v === "string" && ISO_DATE.test(v) ? new Date(v) : v)) : undefined
  if (!res.ok) throw new ApiError(res.status, data?.error ?? `Request failed (${res.status})`)
  return data as T
}

/** GET helper for server components: sends the user to /login when the session is missing or expired. */
export async function api<T>(path: string, query?: Options["query"]): Promise<T> {
  try {
    return await apiFetch<T>(path, { query })
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login")
    throw e
  }
}
