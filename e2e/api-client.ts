import { randomUUID } from "node:crypto"
import { request, type APIRequestContext } from "@playwright/test"

export const API_URL = process.env.API_URL ?? "http://localhost:4000"

let ipCounter = 0
/** /auth is rate limited per IP; the API trusts one proxy hop, so give each test user its own address. */
function fakeIp() {
  ipCounter += 1
  return `10.${process.pid % 250}.${(ipCounter >> 8) & 255}.${ipCounter & 255}`
}

export type TestUser = { id: string; name: string; email: string; password: string; token: string }

export function uniqueEmail(prefix = "e2e") {
  return `${prefix}-${randomUUID().slice(0, 8)}@test.pennypal.app`
}

export const thisYear = () => new Date().getFullYear()

export function kidData(o: Record<string, unknown> = {}) {
  return { name: "Aarav", avatar: "🦁", birthYear: thisYear() - 10, monthlyEarning: 500, earningDay: 1, ...o }
}

/** Thin client for seeding and inspecting data straight through pennypal-api. */
export class PennyPalApi {
  private constructor(
    private ctx: APIRequestContext,
    public readonly user: TestUser
  ) {}

  static async register(name = "E2E Parent"): Promise<PennyPalApi> {
    const anon = await request.newContext({ baseURL: API_URL })
    const password = "password123"
    const email = uniqueEmail()
    const res = await anon.post("/auth/register", {
      data: { name, email, password },
      headers: { "X-Forwarded-For": fakeIp() },
    })
    if (res.status() !== 201) throw new Error(`register failed: ${res.status()} ${await res.text()}`)
    const { token, user } = await res.json()
    await anon.dispose()
    const ctx = await request.newContext({ baseURL: API_URL, extraHTTPHeaders: { Authorization: `Bearer ${token}` } })
    return new PennyPalApi(ctx, { ...user, password, token })
  }

  private async call<T>(method: "get" | "post" | "put" | "delete", path: string, data?: unknown): Promise<T> {
    const res = await this.ctx[method](path, data === undefined ? undefined : { data })
    if (!res.ok()) throw new Error(`${method.toUpperCase()} ${path} failed: ${res.status()} ${await res.text()}`)
    return (res.status() === 204 ? undefined : await res.json()) as T
  }

  get = <T = unknown>(path: string) => this.call<T>("get", path)
  post = <T = { id: string }>(path: string, data: unknown) => this.call<T>("post", path, data)
  put = <T = { id: string }>(path: string, data: unknown) => this.call<T>("put", path, data)

  addKid(o: Record<string, unknown> = {}) {
    return this.post<{ id: string; name: string }>("/kids", kidData(o))
  }

  dispose() {
    return this.ctx.dispose()
  }
}
