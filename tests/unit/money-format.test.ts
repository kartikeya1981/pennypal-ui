import { describe, expect, it } from "vitest"
import { entryTitle, monthLabel, recentMonths, signed, splitRuleLabel } from "@/lib/format"

describe("money formatting", () => {
  it("signs amounts with a real minus sign", () => {
    expect(signed(1500)).toBe("+1,500")
    expect(signed(-20)).toBe("−20")
    expect(signed(0)).toBe("0")
  })

  it("labels months and lists recent months across a year boundary", () => {
    expect(monthLabel("2026-10")).toBe("October 2026")
    expect(recentMonths("2026-02", 4)).toEqual(["2026-02", "2026-01", "2025-12", "2025-11"])
    expect(recentMonths("2026-10")).toHaveLength(12)
  })

  it("describes split rules", () => {
    expect(splitRuleLabel("PERCENT", 30)).toBe("Gets 30% of each Monthly Earning")
    expect(splitRuleLabel("FIXED", 1)).toBe("Gets 1 Kid Coin each month")
    expect(splitRuleLabel("NONE", 0)).toBe("No monthly share yet")
  })

  it("titles statement rows", () => {
    expect(entryTitle("MONTHLY_EARNING", "October 2026")).toBe("Monthly Earning · October 2026")
    expect(entryTitle("EXTRA_EARNING", "Read a book")).toBe("Extra earning · Read a book")
    expect(entryTitle("TRANSFER", "Goal removed: Bike")).toBe("Goal removed: Bike")
    expect(entryTitle("TRANSFER", null)).toBe("Moved Kid Coins")
  })
})
