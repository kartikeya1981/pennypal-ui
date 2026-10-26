import { LogOut } from "lucide-react"
import { BottomNav, SideNav } from "@/components/app-nav"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions/auth"
import { requireUser } from "@/lib/session"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r bg-background p-4 md:flex">
        <Logo href="/dashboard" />
        <SideNav />
        <div className="mt-auto border-t pt-4">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <form action={logout} className="mt-2">
            <Button variant="ghost" size="sm" type="submit" className="w-full justify-start">
              <LogOut /> Sign out
            </Button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur md:hidden">
          <Logo href="/dashboard" />
          <form action={logout}>
            <Button variant="ghost" size="icon-sm" type="submit" aria-label="Sign out">
              <LogOut />
            </Button>
          </form>
        </header>
        <main className="mx-auto max-w-5xl p-4 pb-24 md:p-8">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
