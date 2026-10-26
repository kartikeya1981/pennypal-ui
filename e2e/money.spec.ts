import { PennyPalApi } from "./api-client"
import { expect, test } from "./fixtures"

const thisMonth = () => new Date().toISOString().slice(0, 7)
const monthName = (m: string) =>
  new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })

test.describe("Kid Coins, goals and statement", () => {
  test("adds a goal, sets the split and auto-splits the Monthly Earning @mobile", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid({ name: "Aarav", monthlyEarning: 500 })
    await api.addGoal(kid.id, { name: "Shoes", emoji: "👟", targetAmount: 2000 })
    await shell.goto(`/kids/${kid.id}`)
    const balance = page.getByRole("region", { name: "Balance" })
    await expect(balance).toContainText("0 Kid Coins")
    await expect(balance).toContainText(`${monthName(thisMonth())} Monthly Earning not added yet`)

    const dialog = page.getByRole("dialog")
    await page.getByRole("button", { name: "Add goal" }).click()
    await dialog.getByLabel("Goal name").fill("Video game")
    await dialog.locator("label").filter({ has: page.getByLabel("Icon 🎮", { exact: true }) }).click()
    await dialog.getByLabel("Target (Kid Coins)").fill("1000")
    await dialog.getByRole("button", { name: "Save" }).click()
    await expect(dialog).toBeHidden()
    const game = page.getByRole("article", { name: "Video game" })
    await expect(game).toContainText("No monthly share yet")
    await expect(game).toContainText("0 Kid Coins of 1,000 Kid Coins")

    await page.getByRole("button", { name: "Split rules" }).click()
    await dialog.getByLabel("Video game split type").selectOption("FIXED")
    await dialog.getByLabel("Video game split amount").fill("200")
    await dialog.getByLabel("Shoes split type").selectOption("PERCENT")
    await dialog.getByLabel("Shoes split amount").fill("50")
    await dialog.getByRole("button", { name: "Save" }).click()
    await expect(dialog).toBeHidden()
    await expect(game).toContainText("Gets 200 Kid Coins each month")
    await expect(page.getByRole("article", { name: "Shoes" })).toContainText("Gets 50% of each Monthly Earning")
    const preview = page.getByLabel("Next Monthly Earning split")
    for (const text of ["Video game: 200 Kid Coins", "Shoes: 150 Kid Coins", "Wallet: 150 Kid Coins"]) {
      await expect(preview).toContainText(text)
    }

    await page.getByRole("button", { name: "Monthly Earning", exact: true }).click()
    await expect(dialog.getByLabel("Month")).toHaveValue(thisMonth())
    await dialog.getByRole("button", { name: "Add earning" }).click()
    await expect(dialog).toBeHidden()
    await shell.expectToast("Monthly Earning added")
    await expect(balance).toContainText("500 Kid Coins")
    await expect(balance).toContainText(`✓ ${monthName(thisMonth())} Monthly Earning added`)
    await expect(page.getByLabel("Wallet balance")).toContainText("150 Kid Coins")
    await expect(page.getByLabel("Saved in goals")).toContainText("350 Kid Coins")
    await expect(game).toContainText("200 Kid Coins of 1,000 Kid Coins")
    await expect(page.getByRole("progressbar", { name: "Video game progress" })).toHaveAttribute("aria-valuenow", "20")

    // The same month can't be added twice
    await page.getByRole("button", { name: "Monthly Earning", exact: true }).click()
    await expect(dialog.getByRole("option", { name: `${monthName(thisMonth())} (added)` })).toBeDisabled()
    await dialog.getByRole("button", { name: "Cancel" }).click()

    await page.getByRole("link", { name: "Full statement" }).click()
    await expect(shell.heading()).toHaveText("Aarav's statement")
    const row = page.getByRole("list", { name: "Statement" }).getByRole("listitem").first()
    for (const text of [`Monthly Earning · ${monthName(thisMonth())}`, "+500", "Wallet +150", "🎮 Video game +200", "👟 Shoes +150", "Balance 500"]) {
      await expect(row).toContainText(text)
    }
  })

  test("an extra earning can go straight into a goal and makes it Ready! @mobile", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid()
    await api.addGoal(kid.id, { name: "Tennis racket", emoji: "🎾", targetAmount: 100 })
    await shell.goto(`/kids/${kid.id}`)
    const dialog = page.getByRole("dialog")
    await page.getByRole("button", { name: "Extra earning" }).click()
    await dialog.getByLabel("Amount (Kid Coins)").fill("100")
    await dialog.getByLabel("What it's for").fill("Finished a book")
    await dialog.getByLabel("Add to").selectOption({ label: "🎾 Tennis racket" })
    await dialog.getByRole("button", { name: "Add earning" }).click()
    await expect(dialog).toBeHidden()
    await shell.expectToast("Extra earning added")

    const racket = page.getByRole("article", { name: "Tennis racket" })
    await expect(racket).toContainText("Ready!")
    await expect(racket).toContainText("100 Kid Coins of 100 Kid Coins")
    await expect(page.getByLabel("Wallet balance")).toContainText("0 Kid Coins")
    const recent = page.getByRole("list", { name: "Statement" }).getByRole("listitem").first()
    await expect(recent).toContainText("Extra earning · Finished a book")
    await expect(recent).toContainText("🎾 Tennis racket +100")
  })

  test("shows split errors and keeps what was typed", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid({ monthlyEarning: 500 })
    await api.addGoal(kid.id, { name: "Bike" })
    await api.addGoal(kid.id, { name: "Lego" })
    await shell.goto(`/kids/${kid.id}`)
    const dialog = page.getByRole("dialog")
    await page.getByRole("button", { name: "Split rules" }).click()
    await dialog.getByLabel("Bike split type").selectOption("PERCENT")
    await dialog.getByLabel("Bike split amount").fill("60")
    await dialog.getByLabel("Lego split type").selectOption("PERCENT")
    await dialog.getByLabel("Lego split amount").fill("50")
    await dialog.getByRole("button", { name: "Save" }).click()
    await expect(dialog.locator("p.text-destructive")).toHaveText("Percentages add up to more than 100%")
    await expect(dialog.getByLabel("Bike split amount")).toHaveValue("60")
    await expect(dialog.getByLabel("Lego split type")).toHaveValue("PERCENT")

    await dialog.getByLabel("Lego split type").selectOption("FIXED")
    await dialog.getByLabel("Lego split amount").fill("600")
    await dialog.getByRole("button", { name: "Save" }).click()
    await expect(dialog.locator("p.text-destructive")).toHaveText("Fixed amounts add up to more than the Monthly Earning (500 Kid Coins)")
  })

  test("removing a goal moves its coins back to the Wallet @mobile", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid()
    const goal = await api.addGoal(kid.id, { name: "Video game" })
    await api.earn(kid.id, { kind: "EXTRA", amount: 300, note: "Birthday gift", goalId: goal.id })
    await shell.goto(`/kids/${kid.id}`)
    await expect(page.getByLabel("Wallet balance")).toContainText("0 Kid Coins")
    await page.getByRole("button", { name: "Delete Video game goal" }).click()
    await expect(page.getByRole("article", { name: "Video game" })).toBeHidden()
    await expect(page.getByLabel("Wallet balance")).toContainText("300 Kid Coins")
    await expect(page.getByText("No goals yet")).toBeVisible()

    await shell.goto(`/kids/${kid.id}/statement`)
    const row = page.getByRole("list", { name: "Statement" }).getByRole("listitem").first()
    await expect(row).toContainText("Goal removed: Video game")
    await expect(row).toContainText("Moved")
    await expect(row).toContainText("Wallet +300")
  })

  test("the family dashboard shows each kid's balance", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid({ name: "Meera", monthlyEarning: 300 })
    await api.earn(kid.id, { kind: "EXTRA", amount: 40, note: "Chores" })
    await shell.goto("/dashboard")
    const card = page.getByRole("link", { name: /Meera/ })
    await expect(card.getByLabel("Balance")).toContainText("40 Kid Coins")
    await expect(card).toContainText("+300 Kid Coins / month")
  })

  test("another family's statement is not visible", async ({ shell, authedPage: page }) => {
    const other = await PennyPalApi.register("Other Parent")
    const kid = await other.addKid({ name: "Secret" })
    await other.earn(kid.id, { kind: "EXTRA", amount: 10, note: "Hidden" })
    await shell.goto(`/kids/${kid.id}/statement`)
    await expect(page.getByText("Kid not found")).toBeVisible()
    await expect(page.getByText("Hidden")).toHaveCount(0)
    await other.dispose()
  })
})
