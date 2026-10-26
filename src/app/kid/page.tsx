import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Check, Lock, LogOut } from "lucide-react"
import { Coins } from "@/components/coins"
import { FormDialog } from "@/components/form-dialog"
import { Progress } from "@/components/progress"
import { RewardDestinationField } from "@/components/task-fields"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError, api } from "@/lib/api"
import { logout } from "@/lib/actions/auth"
import { exitKidMode } from "@/lib/actions/kid-mode"
import { submitTask } from "@/lib/actions/tasks"
import { KID_MODE_COOKIE } from "@/lib/cookies"
import { coins, entryTitle, firstName, openGoals, signed } from "@/lib/format"
import { sortTasks } from "@/lib/tasks"
import { pickTip } from "@/lib/tips"
import type { Account, Goal, Kid, KidBadge, StatementRow, Task } from "@/lib/types"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Kid Mode" }

async function loadKid(id: string) {
  try {
    return await api<Kid>(`/kids/${id}`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }
}

export default async function KidModePage() {
  const kidId = (await cookies()).get(KID_MODE_COOKIE)?.value
  if (!kidId) redirect("/dashboard")
  const kid = await loadKid(kidId)
  if (!kid) return <MissingKid />
  const [account, tasks, statement, badges] = await Promise.all([
    api<Account>(`/kids/${kid.id}/account`),
    api<Task[]>(`/kids/${kid.id}/tasks`),
    api<StatementRow[]>(`/kids/${kid.id}/statement`),
    api<KidBadge[]>(`/kids/${kid.id}/badges`),
  ])
  const goals = openGoals(account.goals)
  const achieved = account.goals.filter((g) => g.status === "ACHIEVED")
  const todo = sortTasks(tasks).filter((t) => t.status !== "APPROVED")
  const moneyRows = statement.filter((r) => r.amount !== 0).slice(0, 5)
  const name = firstName(kid.name)
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <header className="mx-auto flex max-w-3xl items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
        <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-full bg-background text-4xl shadow-sm">
          {kid.avatar}
        </span>
        <h1 className="min-w-0 flex-1 text-2xl font-extrabold tracking-tight [overflow-wrap:anywhere]">Hi {name}!</h1>
        <FormDialog
          title="Grown-ups only"
          description="Enter the Kid Mode PIN to go back to the parent screens."
          label="Exit Kid Mode"
          variant="outline"
          icon={<Lock />}
          action={exitKidMode}
          submitLabel="Unlock"
        >
          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="exit-pin">PIN</Label>
            <Input id="exit-pin" name="pin" type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} autoComplete="off" required />
          </div>
        </FormDialog>
      </header>

      <main className="mx-auto grid max-w-3xl gap-6 px-4 pt-2 pb-10">
        <Card aria-label="My money" role="region" className="text-center">
          <CardContent className="grid gap-2 py-2">
            <p className="text-sm font-semibold text-muted-foreground">I have</p>
            <Coins amount={account.total} className="flex-wrap justify-center text-4xl text-coin-foreground" />
            <p className="text-sm text-muted-foreground">
              {coins(account.wallet)} in my Wallet · {coins(account.total - account.wallet)} saved in goals
            </p>
          </CardContent>
        </Card>

        <aside aria-label="Money tip" className="rounded-xl bg-amber-100 p-4 text-amber-950 dark:bg-amber-950 dark:text-amber-100">
          <p className="text-xs font-bold uppercase tracking-wide">💡 Money tip</p>
          <p className="mt-1 font-medium">{pickTip()}</p>
        </aside>

        <section aria-labelledby="kid-goals" className="min-w-0">
          <h2 id="kid-goals" className="mb-3 text-lg font-bold">
            My goals
          </h2>
          {goals.length || achieved.length ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {goals.map((g) => (
                <li key={g.id} className="min-w-0">
                  <GoalJar goal={g} />
                </li>
              ))}
              {achieved.map((g) => (
                <li key={g.id} className="min-w-0">
                  <Card aria-label={g.name} role="article">
                    <CardContent className="flex items-center gap-3">
                      <span aria-hidden className="text-3xl">{g.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold [overflow-wrap:anywhere]">{g.name}</p>
                        <p className="text-sm text-muted-foreground">🏆 You did it! Saved {coins(g.targetAmount)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No goals yet. Ask a grown-up to help you pick one!</p>
          )}
        </section>

        <section aria-labelledby="kid-tasks" className="min-w-0">
          <h2 id="kid-tasks" className="mb-3 text-lg font-bold">
            My tasks
          </h2>
          {todo.length ? (
            <ul className="grid grid-cols-1 gap-3">
              {todo.map((t) => (
                <li key={t.id} className="min-w-0">
                  <Card aria-label={t.title} role="article">
                    <CardContent className="flex flex-wrap items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold [overflow-wrap:anywhere]">{t.title}</p>
                        <p className="text-sm">
                          Earn <Coins amount={t.reward} />
                        </p>
                      </div>
                      {t.status === "SUBMITTED" ? (
                        <Badge className="bg-amber-500 text-white">Waiting for a grown-up</Badge>
                      ) : (
                        <FormDialog
                          title="I did it!"
                          description={`Great job! Where should the ${coins(t.reward)} go?`}
                          label="I did it"
                          icon={<Check />}
                          action={submitTask.bind(null, t.id)}
                          submitLabel="Send to a grown-up"
                          successMessage="Sent! A grown-up will check it."
                        >
                          <RewardDestinationField goals={goals} hint="Pick your Wallet or one of your goals" />
                        </FormDialog>
                      )}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No tasks right now.</p>
          )}
        </section>

        <section aria-labelledby="kid-badges">
          <h2 id="kid-badges" className="mb-3 text-lg font-bold">
            My badges
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges.map((b) => (
              <li
                key={b.code}
                aria-label={`${b.name}${b.earnedAt ? "" : " (not earned yet)"}`}
                className={cn("rounded-xl bg-card p-3 text-center ring-1 ring-foreground/10", !b.earnedAt && "opacity-50 grayscale")}
              >
                <p aria-hidden className="text-3xl">
                  {b.earnedAt ? b.emoji : "🔒"}
                </p>
                <p className="mt-1 text-sm font-bold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="kid-money">
          <h2 id="kid-money" className="mb-3 text-lg font-bold">
            Money in &amp; out
          </h2>
          {moneyRows.length ? (
            <ul aria-label="Money in and out" className="divide-y rounded-xl bg-card ring-1 ring-foreground/10">
              {moneyRows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 p-3">
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{entryTitle(r.type, r.note)}</span>
                  <span className={cn("shrink-0 font-bold tabular-nums", r.amount > 0 ? "text-emerald-600" : "text-destructive")}>
                    {r.amount > 0 ? "In" : "Out"} {signed(r.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing yet.</p>
          )}
        </section>
      </main>
    </div>
  )
}

function GoalJar({ goal }: { goal: Goal }) {
  const left = Math.max(0, goal.targetAmount - goal.balance)
  return (
    <Card aria-label={goal.name} role="article">
      <CardContent className="grid gap-2">
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-3xl">
            {goal.emoji}
          </span>
          <p className="min-w-0 flex-1 font-bold [overflow-wrap:anywhere]">{goal.name}</p>
        </div>
        <Progress value={goal.balance} max={goal.targetAmount} label={`${goal.name} progress`} />
        <p className="text-sm font-medium">
          {left === 0 ? "🎉 Ready! Ask a grown-up to cash it out." : `${coins(left)} more to go`}
        </p>
      </CardContent>
    </Card>
  )
}

function MissingKid() {
  return (
    <main className="mx-auto grid max-w-md gap-4 p-8 text-center">
      <h1 className="text-2xl font-extrabold">This profile is gone</h1>
      <p className="text-muted-foreground">Ask a grown-up to sign in again.</p>
      <form action={logout}>
        <Button type="submit">
          <LogOut /> Sign out
        </Button>
      </form>
    </main>
  )
}
