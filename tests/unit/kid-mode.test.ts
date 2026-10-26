import { describe, expect, it } from "vitest"
import { entryTitle, openGoals } from "@/lib/format"
import { kidModeApiAllowed, kidModePathAllowed } from "@/lib/kid-mode"
import { MONEY_TIPS, pickTip } from "@/lib/tips"

describe("Kid Mode guards", () => {
  it("only allows the kid screen and sign-in pages", () => {
    expect(kidModePathAllowed("/kid")).toBe(true)
    expect(kidModePathAllowed("/login")).toBe(true)
    for (const p of ["/kids", "/kids/abc", "/kid/x", "/dashboard", "/settings", "/"]) expect(kidModePathAllowed(p)).toBe(false)
  })

  it("only allows saying 'I did it' and unlocking", () => {
    expect(kidModeApiAllowed("POST", "/tasks/abc/submit")).toBe(true)
    expect(kidModeApiAllowed("POST", "/me/kid-mode/unlock")).toBe(true)
    expect(kidModeApiAllowed("POST", "/tasks/abc/approve")).toBe(false)
    expect(kidModeApiAllowed("POST", "/kids/abc/payouts")).toBe(false)
    expect(kidModeApiAllowed("PUT", "/me/kid-mode-pin")).toBe(false)
    expect(kidModeApiAllowed("DELETE", "/tasks/abc/submit")).toBe(false)
  })
})

describe("money tips", () => {
  it("picks one tip from the list for any random value", () => {
    expect(pickTip(() => 0)).toBe(MONEY_TIPS[0])
    expect(pickTip(() => 0.9999)).toBe(MONEY_TIPS[MONEY_TIPS.length - 1])
    expect(MONEY_TIPS).toContain(pickTip())
  })
})

describe("cash-outs and achieved goals", () => {
  it("titles cash-outs", () => {
    expect(entryTitle("PAYOUT", "Bought a racket")).toBe("Cash out · Bought a racket")
    expect(entryTitle("PAYOUT", null)).toBe("Cash out")
  })

  it("leaves out achieved goals", () => {
    const goals = [{ id: "a", status: "ACTIVE" }, { id: "b", status: "ACHIEVED" }, { id: "c", status: "READY" }]
    expect(openGoals(goals).map((g) => g.id)).toEqual(["a", "c"])
  })
})
