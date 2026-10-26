import { describe, expect, it } from "vitest"
import { ageFromBirthYear, ageLabel, coins, earningSchedule, firstName, ordinal } from "@/lib/format"

describe("coins", () => {
  it.each([
    [0, "0 Kid Coins"],
    [1, "1 Kid Coin"],
    [-1, "-1 Kid Coin"],
    [500, "500 Kid Coins"],
    [125000, "1,25,000 Kid Coins"],
    [-2500, "-2,500 Kid Coins"],
  ])("formats %d as %s", (n, expected) => {
    expect(coins(n)).toBe(expected)
  })
})

describe("ages", () => {
  const now = new Date("2026-06-15T00:00:00Z")
  it("computes the age reached this calendar year", () => {
    expect(ageFromBirthYear(2014, now)).toBe(12)
    expect(ageFromBirthYear(2026, now)).toBe(0)
    expect(ageFromBirthYear(2030, now)).toBe(0)
  })
  it.each([
    [2026, "Under 1"],
    [2025, "1 year old"],
    [2016, "10 years old"],
  ])("labels birth year %d as %s", (year, label) => {
    expect(ageLabel(year, now)).toBe(label)
  })
})

describe("ordinal", () => {
  it.each([
    [1, "1st"],
    [2, "2nd"],
    [3, "3rd"],
    [4, "4th"],
    [11, "11th"],
    [12, "12th"],
    [13, "13th"],
    [21, "21st"],
    [22, "22nd"],
    [23, "23rd"],
    [31, "31st"],
  ])("%d -> %s", (n, expected) => {
    expect(ordinal(n)).toBe(expected)
  })
})

describe("earningSchedule", () => {
  it("describes regular days", () => {
    expect(earningSchedule(1)).toBe("on the 1st of every month")
    expect(earningSchedule(28)).toBe("on the 28th of every month")
  })
  it("explains short-month handling for days 29-31", () => {
    expect(earningSchedule(29)).toBe("on the 29th (or the last day of shorter months)")
    expect(earningSchedule(31)).toBe("on the 31st (or the last day of shorter months)")
  })
})

describe("firstName", () => {
  it("returns the first word of a trimmed name", () => {
    expect(firstName("  Priya Sharma ")).toBe("Priya")
    expect(firstName("Rahul")).toBe("Rahul")
  })
})
