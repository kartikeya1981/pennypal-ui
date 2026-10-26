import { Field, selectClass } from "@/components/field"
import { Label } from "@/components/ui/label"
import { MAX_EXTRA_EARNING } from "@/lib/constants"
import { coins, monthLabel, recentMonths } from "@/lib/format"
import type { Goal } from "@/lib/types"

export function MonthlyEarningFields({
  amount,
  currentMonth,
  creditedMonths,
}: {
  amount: number
  currentMonth: string
  creditedMonths: string[]
}) {
  const months = recentMonths(currentMonth)
  const open = months.find((m) => !creditedMonths.includes(m)) ?? currentMonth
  return (
    <div className="grid gap-1.5 sm:col-span-2">
      <input type="hidden" name="kind" value="MONTHLY" />
      <Label htmlFor="f-month">Month</Label>
      <select id="f-month" name="month" defaultValue={open} className={selectClass} aria-describedby="f-month-hint">
        {months.map((m) => {
          const added = creditedMonths.includes(m)
          return (
            <option key={m} value={m} disabled={added}>
              {monthLabel(m)}
              {added ? " (added)" : ""}
            </option>
          )
        })}
      </select>
      <p id="f-month-hint" className="text-xs text-muted-foreground">
        {coins(amount)} will be added and split across goals using the split rules.
      </p>
    </div>
  )
}

export function ExtraEarningFields({ goals }: { goals: Goal[] }) {
  return (
    <>
      <input type="hidden" name="kind" value="EXTRA" />
      <Field label="Amount (Kid Coins)" name="amount" type="number" min={1} max={MAX_EXTRA_EARNING} required />
      <Field label="What it's for" name="note" required placeholder="e.g. Helped wash the car" />
      <Field
        label="Add to"
        name="goalId"
        options={[{ value: "", label: "Wallet" }, ...goals.map((g) => ({ value: g.id, label: `${g.emoji} ${g.name}` }))]}
        defaultValue=""
        hint="Let your kid choose: the Wallet or one of their goals"
        full
      />
    </>
  )
}
