import { coins } from "@/lib/format"
import { cn } from "@/lib/utils"

/** An amount of Kid Coins with a coin badge, e.g. "🪙 1,250 Kid Coins". */
export function Coins({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-semibold tabular-nums", className)}>
      <span aria-hidden>🪙</span>
      {coins(amount)}
    </span>
  )
}
