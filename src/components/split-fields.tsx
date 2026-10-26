import { selectClass } from "@/components/field"
import { Input } from "@/components/ui/input"
import { coins } from "@/lib/format"
import type { Goal } from "@/lib/types"

/** One row per goal: None / % / Fixed and a value. Read by `saveSplit`. */
export function SplitFields({ goals, monthlyEarning }: { goals: Goal[]; monthlyEarning: number }) {
  return (
    <>
      <p className="text-sm text-muted-foreground sm:col-span-2">
        Each Monthly Earning of {coins(monthlyEarning)} is split like this. Fixed amounts come first, then percentages of
        what&apos;s left. Anything left over stays in the Wallet.
      </p>
      {goals.map((g) => (
        <div key={g.id} role="group" aria-label={g.name} className="grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] items-center gap-2 sm:col-span-2">
          <input type="hidden" name="goalId" value={g.id} />
          <span className="truncate text-sm font-medium">
            <span aria-hidden>{g.emoji}</span> {g.name}
          </span>
          <select name={`type-${g.id}`} aria-label={`${g.name} split type`} defaultValue={g.allocationType} className={selectClass}>
            <option value="NONE">None</option>
            <option value="PERCENT">%</option>
            <option value="FIXED">Fixed</option>
          </select>
          <Input
            name={`value-${g.id}`}
            aria-label={`${g.name} split amount`}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            placeholder="0"
            defaultValue={g.allocationValue || ""}
          />
        </div>
      ))}
    </>
  )
}
