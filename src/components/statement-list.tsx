import { entryTitle, plainNumber, shortDate, signed } from "@/lib/format"
import type { StatementRow } from "@/lib/types"
import { cn } from "@/lib/utils"

const ICONS: Record<string, string> = { MONTHLY_EARNING: "📅", EXTRA_EARNING: "⭐", TRANSFER: "🔁" }

export function StatementList({ rows }: { rows: StatementRow[] }) {
  return (
    <ul aria-label="Statement" className="divide-y rounded-xl bg-card ring-1 ring-foreground/10">
      {rows.map((r) => (
        <li key={r.id} className="flex items-start gap-3 p-3">
          <span aria-hidden className="pt-0.5 text-xl">
            {ICONS[r.type] ?? "🪙"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold [overflow-wrap:anywhere]">{entryTitle(r.type, r.note)}</p>
            <p className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</p>
            {r.legs.length > 0 && (
              <p className="mt-1.5 flex flex-wrap gap-1">
                {r.legs.map((l) => (
                  <span key={l.goalId ?? "wallet"} className="max-w-full truncate rounded-full bg-muted px-2 py-0.5 text-xs">
                    {l.goalId ? `${l.goalEmoji} ${l.goalName}` : "Wallet"} {signed(l.amount)}
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className={cn("font-bold tabular-nums", r.amount > 0 && "text-emerald-600", r.amount < 0 && "text-destructive")}>
              {r.amount === 0 ? "Moved" : signed(r.amount)}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">Balance {plainNumber(r.balanceAfter)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
