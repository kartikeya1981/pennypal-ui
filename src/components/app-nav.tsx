"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/dashboard", label: "Family", icon: Users, match: ["/dashboard", "/kids"] },
  { href: "/settings", label: "Settings", icon: Settings, match: ["/settings"] },
]

function useActive() {
  const pathname = usePathname()
  return (match: string[]) => match.some((m) => pathname === m || pathname.startsWith(`${m}/`))
}

export function SideNav() {
  const isActive = useActive()
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, match }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(match) ? "page" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
            isActive(match) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}

/** Fixed tab bar shown on phones instead of the sidebar. */
export function BottomNav() {
  const isActive = useActive()
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-2">
        {NAV.map(({ href, label, icon: Icon, match }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(match) ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-xs font-semibold",
                isActive(match) ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
