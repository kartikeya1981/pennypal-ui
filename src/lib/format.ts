const number = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 })

export const COIN_NAME = "Kid Coins"

/** "1,250 Kid Coins" (Indian digit grouping; "1 Kid Coin" for a single coin). */
export function coins(amount: number) {
  return `${number.format(amount)} ${Math.abs(amount) === 1 ? "Kid Coin" : COIN_NAME}`
}

/** Age this calendar year, which is all PennyPal knows from a birth year. */
export function ageFromBirthYear(birthYear: number, now = new Date()) {
  return Math.max(0, now.getFullYear() - birthYear)
}

export function ageLabel(birthYear: number, now = new Date()) {
  const age = ageFromBirthYear(birthYear, now)
  return age === 0 ? "Under 1" : `${age} ${age === 1 ? "year" : "years"} old`
}

export function ordinal(n: number) {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  return `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th"}`
}

export function earningSchedule(day: number) {
  return day >= 29 ? `on the ${ordinal(day)} (or the last day of shorter months)` : `on the ${ordinal(day)} of every month`
}

/** "+500", "−200" or "0" (true minus sign). */
export function signed(amount: number) {
  return `${amount > 0 ? "+" : amount < 0 ? "−" : ""}${number.format(Math.abs(amount))}`
}

export function plainNumber(amount: number) {
  return number.format(amount)
}

/** "2026-10" -> "October 2026" */
export function monthLabel(month: string) {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
}

/** The `count` months ending at `current` ("2026-10"), newest first. */
export function recentMonths(current: string, count = 12) {
  const [y, m] = current.split("-").map(Number)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - i, 1))
    return d.toISOString().slice(0, 7)
  })
}

export function shortDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
}

export function splitRuleLabel(type: string, value: number) {
  if (type === "PERCENT") return `Gets ${value}% of each Monthly Earning`
  if (type === "FIXED") return `Gets ${coins(value)} each month`
  return "No monthly share yet"
}

export function entryTitle(type: string, note: string | null) {
  if (type === "MONTHLY_EARNING") return `Monthly Earning${note ? ` · ${note}` : ""}`
  if (type === "EXTRA_EARNING") return `Extra earning${note ? ` · ${note}` : ""}`
  if (type === "TASK_EARNING") return `Task reward${note ? ` · ${note}` : ""}`
  return note ?? "Moved Kid Coins"
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name
}

/** "2026-10-31" for a date input. */
export function isoDay(d: string | Date) {
  return new Date(d).toISOString().slice(0, 10)
}

export function taskSchedule(dueDate: string | Date | null, recurrence: string) {
  const due = dueDate
    ? `Due ${new Date(dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}`
    : null
  const repeat = recurrence === "WEEKLY" ? "Repeats weekly" : recurrence === "MONTHLY" ? "Repeats monthly" : null
  return [due, repeat].filter(Boolean).join(" · ")
}
