export type Option = { value: string; label: string }

export const AVATARS = ["🦊", "🦁", "🐼", "🐯", "🐨", "🐸", "🦄", "🐙", "🐧", "🐶", "🐱", "🐵", "🚀", "⚽", "🎨", "🎮"]

export const DEFAULT_AVATAR = AVATARS[0]

/** Kid profiles are for children under 18, matching the API rule. */
export function birthYearRange(now = new Date()) {
  const year = now.getFullYear()
  return { min: year - 17, max: year }
}

export const MAX_MONTHLY_EARNING = 1_000_000

export const EARNING_DAYS: Option[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[day % 10] ?? "th")
  return { value: String(day), label: `${day}${suffix}` }
})
