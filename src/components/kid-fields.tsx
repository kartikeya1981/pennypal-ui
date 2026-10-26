import { AvatarPicker } from "@/components/avatar-picker"
import { Field } from "@/components/field"
import { birthYearRange, EARNING_DAYS, MAX_MONTHLY_EARNING } from "@/lib/constants"
import type { Kid } from "@/lib/types"

export function KidFields({ kid }: { kid?: Kid }) {
  const { min, max } = birthYearRange()
  return (
    <>
      <Field label="Name" name="name" defaultValue={kid?.name} required placeholder="e.g. Aarav" full />
      <AvatarPicker defaultValue={kid?.avatar} />
      <Field label="Birth year" name="birthYear" type="number" min={min} max={max} defaultValue={kid?.birthYear} required hint="PennyPal is for kids under 18" />
      <Field
        label="Monthly earning (Kid Coins)"
        name="monthlyEarning"
        type="number"
        max={MAX_MONTHLY_EARNING}
        defaultValue={kid?.monthlyEarning ?? 0}
        required
        hint="Added to their account every month"
      />
      <Field label="Earning day" name="earningDay" options={EARNING_DAYS} defaultValue={kid?.earningDay ?? 1} required hint="Days 29–31 use the last day of shorter months" full />
    </>
  )
}
