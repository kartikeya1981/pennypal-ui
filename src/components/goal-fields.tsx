import { EmojiPicker } from "@/components/avatar-picker"
import { Field } from "@/components/field"
import { DEFAULT_GOAL_EMOJI, GOAL_EMOJIS, MAX_GOAL_TARGET } from "@/lib/constants"
import type { Goal } from "@/lib/types"

export function GoalFields({ goal }: { goal?: Goal }) {
  return (
    <>
      <Field label="Goal name" name="name" defaultValue={goal?.name} required placeholder="e.g. Tennis racket" full />
      <EmojiPicker name="emoji" legend="Icon" options={GOAL_EMOJIS} defaultValue={goal?.emoji ?? DEFAULT_GOAL_EMOJI} />
      <Field
        label="Target (Kid Coins)"
        name="targetAmount"
        type="number"
        min={1}
        max={MAX_GOAL_TARGET}
        defaultValue={goal?.targetAmount}
        required
        hint="How many Kid Coins it costs"
        full
      />
    </>
  )
}
