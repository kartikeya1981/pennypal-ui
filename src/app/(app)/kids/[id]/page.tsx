import Link from "next/link"
import { ArrowLeft, ArrowLeftRight, ArrowRight, Banknote, CalendarPlus, PieChart, Smile, Star } from "lucide-react"
import { Coins } from "@/components/coins"
import { DeleteButton } from "@/components/delete-button"
import { ExtraEarningFields, MonthlyEarningFields } from "@/components/earning-fields"
import { EmptyState } from "@/components/empty-state"
import { FormDialog } from "@/components/form-dialog"
import { GoalFields } from "@/components/goal-fields"
import { KidFields } from "@/components/kid-fields"
import { CashOutFields, MoveCoinsFields } from "@/components/money-move-fields"
import { Progress } from "@/components/progress"
import { SplitFields } from "@/components/split-fields"
import { StatementList } from "@/components/statement-list"
import { TaskFields } from "@/components/task-fields"
import { TaskList } from "@/components/task-list"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import { PinFields } from "@/app/(app)/settings/kid-mode-pin-form"
import { addEarning, cashOut, createGoal, deleteGoal, moveCoins, saveSplit, updateGoal } from "@/lib/actions/account"
import { enterKidMode } from "@/lib/actions/kid-mode"
import { deleteKid, updateKid } from "@/lib/actions/kids"
import { createTask } from "@/lib/actions/tasks"
import { ageLabel, coins, earningSchedule, firstName, monthLabel, openGoals, splitRuleLabel } from "@/lib/format"
import { getKidOr404 } from "@/lib/kids"
import { requireUser } from "@/lib/session"
import type { Account, Goal, SplitPreview, StatementRow, Task } from "@/lib/types"

export default async function KidPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const kid = await getKidOr404(id)
  const [user, account, preview, statement, tasks] = await Promise.all([
    requireUser(),
    api<Account>(`/kids/${id}/account`),
    api<SplitPreview>(`/kids/${id}/allocations/preview`),
    api<StatementRow[]>(`/kids/${id}/statement`),
    api<Task[]>(`/kids/${id}/tasks`),
  ])
  const goals = openGoals(account.goals)
  const achieved = account.goals.filter((g) => g.status === "ACHIEVED")
  const thisMonthAdded = account.creditedMonths.includes(account.currentMonth)
  return (
    <>
      <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Family
      </Link>
      <div className="mb-6 flex items-center gap-4">
        <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-4xl">
          {kid.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{kid.name}</h1>
          <p className="text-sm text-muted-foreground">{ageLabel(kid.birthYear)}</p>
        </div>
        <div className="flex items-center gap-1">
          <FormDialog
            title="Kid Mode"
            description={
              user.hasKidModePin
                ? `Hand your device to ${firstName(kid.name)}. You'll need your PIN to leave Kid Mode.`
                : `Hand your device to ${firstName(kid.name)}. First pick a 4-digit PIN you'll need to leave Kid Mode.`
            }
            label="Kid Mode"
            variant="outline"
            icon={<Smile />}
            action={enterKidMode.bind(null, kid.id)}
            submitLabel="Start Kid Mode"
          >
            {user.hasKidModePin ? null : <PinFields />}
          </FormDialog>
          <FormDialog title="Edit profile" mode="edit" action={updateKid.bind(null, kid.id)}>
            <KidFields kid={kid} />
          </FormDialog>
          <DeleteButton action={deleteKid.bind(null, kid.id)} label={`${kid.name}'s profile`} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <Card aria-label="Balance" role="region">
            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total balance</p>
                <Coins amount={account.total} className="flex-wrap text-3xl text-coin-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-lg bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Wallet · free to use</p>
                  <p aria-label="Wallet balance">
                    <Coins amount={account.wallet} />
                  </p>
                </div>
                <div className="min-w-0 rounded-lg bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Saved in goals</p>
                  <p aria-label="Saved in goals">
                    <Coins amount={account.total - account.wallet} />
                  </p>
                </div>
              </div>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">Monthly Earning:</span> {coins(kid.monthlyEarning)} {earningSchedule(kid.earningDay)}
                </p>
                {kid.monthlyEarning > 0 && (
                  <p className="text-muted-foreground">
                    {thisMonthAdded
                      ? `✓ ${monthLabel(account.currentMonth)} Monthly Earning added`
                      : `${monthLabel(account.currentMonth)} Monthly Earning not added yet`}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {kid.monthlyEarning > 0 && (
                  <FormDialog
                    title="Add Monthly Earning"
                    description={`Credit ${kid.name}'s Monthly Earning for a month. Each month can only be added once.`}
                    label="Monthly Earning"
                    icon={<CalendarPlus />}
                    action={addEarning.bind(null, kid.id)}
                    submitLabel="Add earning"
                    successMessage="Monthly Earning added"
                  >
                    <MonthlyEarningFields amount={kid.monthlyEarning} currentMonth={account.currentMonth} creditedMonths={account.creditedMonths} />
                  </FormDialog>
                )}
                <FormDialog
                  title="Add extra earning"
                  description="A one-off reward, like for finishing a book or helping at home"
                  label="Extra earning"
                  variant="outline"
                  icon={<Star />}
                  action={addEarning.bind(null, kid.id)}
                  submitLabel="Add earning"
                  successMessage="Extra earning added"
                >
                  <ExtraEarningFields goals={goals} />
                </FormDialog>
                {account.total > 0 && (
                  <FormDialog
                    title="Cash out"
                    description={`Record real money you give ${kid.name}. The Kid Coins are taken from the Wallet or a goal.`}
                    label="Cash out"
                    variant="outline"
                    icon={<Banknote />}
                    action={cashOut.bind(null, kid.id)}
                    submitLabel="Cash out"
                    successMessage="Cash-out recorded"
                  >
                    <CashOutFields wallet={account.wallet} goals={goals} />
                  </FormDialog>
                )}
                {account.total > 0 && goals.length > 0 && (
                  <FormDialog
                    title="Move Kid Coins"
                    description="Move coins between the Wallet and goals"
                    label="Move coins"
                    variant="outline"
                    icon={<ArrowLeftRight />}
                    action={moveCoins.bind(null, kid.id)}
                    submitLabel="Move"
                    successMessage="Kid Coins moved"
                  >
                    <MoveCoinsFields wallet={account.wallet} goals={goals} />
                  </FormDialog>
                )}
              </div>
            </CardContent>
          </Card>

          <section aria-labelledby="tasks-heading">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 id="tasks-heading" className="text-lg font-bold">
                Tasks
              </h2>
              <FormDialog
                title="Add a task"
                description={`Something ${kid.name} can do to earn extra Kid Coins`}
                label="Add task"
                action={createTask.bind(null, kid.id)}
              >
                <TaskFields />
              </FormDialog>
            </div>
            {tasks.length ? (
              <TaskList tasks={tasks} goals={account.goals} kidName={kid.name} />
            ) : (
              <p className="text-sm text-muted-foreground">No tasks yet. Add one, like finishing a book or helping with chores.</p>
            )}
          </section>

          <section aria-labelledby="recent-heading">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 id="recent-heading" className="text-lg font-bold">
                Recent activity
              </h2>
              <Link href={`/kids/${kid.id}/statement`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Full statement <ArrowRight className="size-4" />
              </Link>
            </div>
            {statement.length ? (
              <StatementList rows={statement.slice(0, 3)} />
            ) : (
              <p className="text-sm text-muted-foreground">No earnings yet. Add a Monthly Earning to get started.</p>
            )}
          </section>
        </div>

        <section aria-labelledby="goals-heading" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="goals-heading" className="text-lg font-bold">
              Goals
            </h2>
            <div className="flex gap-2">
              {goals.length > 0 && (
                <FormDialog
                  title="Monthly split"
                  label="Split rules"
                  variant="outline"
                  icon={<PieChart />}
                  action={saveSplit.bind(null, kid.id)}
                >
                  <SplitFields goals={goals} monthlyEarning={kid.monthlyEarning} />
                </FormDialog>
              )}
              <FormDialog title="Add a goal" description={`Something ${kid.name} wants to save for`} label="Add goal" action={createGoal.bind(null, kid.id)}>
                <GoalFields />
              </FormDialog>
            </div>
          </div>
          {goals.length === 0 && achieved.length === 0 ? (
            <EmptyState title="No goals yet" description={`Help ${kid.name} pick something to save for, like a video game or a tennis racket.`} />
          ) : (
            <>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {goals.map((goal) => (
                  <li key={goal.id} className="min-w-0">
                    <GoalCard goal={goal} />
                  </li>
                ))}
              </ul>
              {kid.monthlyEarning > 0 && goals.length > 0 && (
                <SplitPreviewNote preview={preview} goals={goals} amount={kid.monthlyEarning} />
              )}
              {achieved.length > 0 && (
                <>
                  <h3 className="mt-6 mb-3 font-bold">Achieved 🏆</h3>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {achieved.map((goal) => (
                      <li key={goal.id} className="min-w-0">
                        <GoalCard goal={goal} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const done = goal.status === "ACHIEVED"
  return (
    <Card aria-label={goal.name} role="article">
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
            {goal.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{goal.name}</p>
            <p className="text-xs text-muted-foreground">
              {done ? `Saved ${coins(goal.targetAmount)} and cashed out` : splitRuleLabel(goal.allocationType, goal.allocationValue)}
            </p>
          </div>
          {goal.status === "READY" && <Badge className="bg-emerald-600 text-white">Ready!</Badge>}
          {done && <Badge className="bg-violet-600 text-white">Achieved</Badge>}
          <div className="flex shrink-0 items-center">
            {!done && (
              <FormDialog title={`Edit ${goal.name}`} mode="edit" action={updateGoal.bind(null, goal.id)}>
                <GoalFields goal={goal} />
              </FormDialog>
            )}
            <DeleteButton
              action={deleteGoal.bind(null, goal.id)}
              label={`${goal.name} goal`}
              confirmText={`Remove the ${goal.name} goal? Its Kid Coins go back to the Wallet.`}
            />
          </div>
        </div>
        {!done && (
          <>
            <Progress value={goal.balance} max={goal.targetAmount} label={`${goal.name} progress`} />
            <p className="text-sm">
              <Coins amount={goal.balance} /> <span className="text-muted-foreground">of {coins(goal.targetAmount)}</span>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function SplitPreviewNote({ preview, goals, amount }: { preview: SplitPreview; goals: Goal[]; amount: number }) {
  const byId = new Map(goals.map((g) => [g.id, g]))
  return (
    <div className="mt-3 rounded-lg bg-muted/60 p-3 text-sm" aria-label="Next Monthly Earning split">
      <p className="font-semibold">Next Monthly Earning ({coins(amount)}) goes to</p>
      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
        {preview.shares.map((s) => {
          const g = byId.get(s.goalId)
          return (
            <li key={s.goalId} className="max-w-full truncate">
              {g?.emoji} {g?.name}: {coins(s.amount)}
            </li>
          )
        })}
        <li>Wallet: {coins(preview.wallet)}</li>
      </ul>
    </div>
  )
}
