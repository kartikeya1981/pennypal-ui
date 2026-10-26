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

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name
}
