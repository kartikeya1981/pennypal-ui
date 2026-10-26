import { Field } from "@/components/field"
import { coins } from "@/lib/format"
import type { Goal } from "@/lib/types"

type Pots = { wallet: number; goals: Goal[] }

function potOptions({ wallet, goals }: Pots) {
  return [
    { value: "", label: `Wallet (${coins(wallet)})` },
    ...goals.map((g) => ({ value: g.id, label: `${g.emoji} ${g.name} (${coins(g.balance)})` })),
  ]
}

const NOTE_MAX = 80

export function CashOutFields(pots: Pots) {
  return (
    <>
      <Field label="Take from" name="goalId" options={potOptions(pots)} defaultValue="" full />
      <Field label="Amount (Kid Coins)" name="amount" type="number" min={1} required />
      <Field
        label="What it's for"
        name="note"
        placeholder="e.g. Bought a tennis racket"
        hint={`Optional, up to ${NOTE_MAX} characters. Cashing out a whole jar that reached its target marks the goal achieved.`}
        full
      />
    </>
  )
}

export function MoveCoinsFields(pots: Pots) {
  const options = potOptions(pots)
  return (
    <>
      <Field label="From" name="fromGoalId" options={options} defaultValue="" />
      <Field label="To" name="toGoalId" options={options} defaultValue={pots.goals[0]?.id ?? ""} />
      <Field label="Amount (Kid Coins)" name="amount" type="number" min={1} required />
      <Field label="Note" name="note" placeholder="Optional" />
    </>
  )
}
