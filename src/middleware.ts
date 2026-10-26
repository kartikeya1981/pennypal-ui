import { NextResponse, type NextRequest } from "next/server"
import { KID_MODE_COOKIE, TOKEN_COOKIE } from "@/lib/cookies"
import { kidModePathAllowed } from "@/lib/kid-mode"

/** While Kid Mode is on, keeps the device on the kid's screen until a parent unlocks it. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const kidMode = req.cookies.has(KID_MODE_COOKIE)
  if (!kidMode) return pathname === "/kid" ? NextResponse.redirect(new URL("/dashboard", req.url)) : NextResponse.next()
  if (!req.cookies.has(TOKEN_COOKIE)) {
    const res = NextResponse.redirect(new URL("/login", req.url))
    res.cookies.delete(KID_MODE_COOKIE)
    return res
  }
  return kidModePathAllowed(pathname) ? NextResponse.next() : NextResponse.redirect(new URL("/kid", req.url))
}

export const config = { matcher: ["/((?!_next/|.*\\..*).*)"] }
