import { describe, expect, it } from "vitest"
import { AVATARS, birthYearRange, DEFAULT_AVATAR, EARNING_DAYS } from "@/lib/constants"
import { ordinal } from "@/lib/format"

describe("birthYearRange", () => {
  it("allows kids from newborn to 17", () => {
    expect(birthYearRange(new Date("2026-01-01T12:00:00Z"))).toEqual({ min: 2009, max: 2026 })
  })
})

describe("EARNING_DAYS", () => {
  it("offers every day 1-31 with ordinal labels", () => {
    expect(EARNING_DAYS).toHaveLength(31)
    for (const [i, d] of EARNING_DAYS.entries()) {
      expect(d.value).toBe(String(i + 1))
      expect(d.label).toBe(ordinal(i + 1))
    }
  })
})

describe("AVATARS", () => {
  it("are unique and start with the API default", () => {
    expect(new Set(AVATARS).size).toBe(AVATARS.length)
    expect(DEFAULT_AVATAR).toBe("🦊")
  })
})
