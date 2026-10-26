import { PennyPalApi, thisYear } from "./api-client"
import { expect, test } from "./fixtures"
import { KidForm } from "./pages/kid-form"

test.describe("kid profiles", () => {
  test("adds a kid from the family dashboard @mobile", async ({ shell, authedPage: page }) => {
    await shell.goto("/dashboard")
    await page.getByRole("button", { name: "Add kid" }).click()
    const form = new KidForm(page)
    await form.submit({ name: "Meera", avatar: "🦄", birthYear: thisYear() - 9, monthlyEarning: 300, earningDay: 5 })
    await shell.expectToast("Saved")

    const card = page.getByRole("link", { name: /Meera/ })
    await expect(card).toContainText("9 years old")
    await expect(card).toContainText("300 Kid Coins")
    await expect(card).toContainText("on the 5th of every month")
    await expect(card).toContainText("🦄")
  })

  test("lists several kids in the order they were added", async ({ api, shell, authedPage: page }) => {
    await api.addKid({ name: "Aarav" })
    await api.addKid({ name: "Meera", avatar: "🦄" })
    await api.addKid({ name: "Kabir", avatar: "🐼" })
    await shell.goto("/dashboard")
    await expect(page.getByRole("listitem").getByRole("link")).toHaveText([/Aarav/, /Meera/, /Kabir/])
  })

  test("shows API validation errors in the form and keeps the dialog open", async ({ shell, authedPage: page }) => {
    await shell.goto("/dashboard")
    await page.getByRole("button", { name: "Add kid" }).click()
    const form = new KidForm(page)
    // Bypass the browser's min/max check to exercise the API rule.
    await form.root().getByLabel("Birth year").evaluate((el) => el.removeAttribute("min"))
    await form.fill({ name: "Too Old", birthYear: thisYear() - 18, monthlyEarning: 100 })
    await form.save()
    await expect(form.error()).toHaveText("PennyPal is for kids under 18")
    await expect(form.root()).toBeVisible()
  })

  test("opens a kid's page, edits the profile and deletes it @mobile", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid({ name: "Aarav", monthlyEarning: 500, earningDay: 1 })
    await shell.goto("/dashboard")
    await page.getByRole("link", { name: /Aarav/ }).click()
    await expect(page).toHaveURL(new RegExp(`/kids/${kid.id}$`))
    await expect(shell.heading()).toHaveText("Aarav")
    await expect(page.getByText("500 Kid Coins")).toBeVisible()

    await page.getByRole("button", { name: "Edit profile" }).click()
    await new KidForm(page).submit({ name: "Aarav R", monthlyEarning: 750, earningDay: 31 })
    await expect(shell.heading()).toHaveText("Aarav R")
    await expect(page.getByText("750 Kid Coins")).toBeVisible()
    await expect(page.getByText("on the 31st (or the last day of shorter months)")).toBeVisible()

    await page.getByRole("button", { name: "Delete Aarav R's profile" }).click()
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByText("No kids yet")).toBeVisible()
    expect(await api.get("/kids")).toEqual([])
  })

  test("cannot open another family's kid", async ({ shell, authedPage: page }) => {
    const other = await PennyPalApi.register("Other Parent")
    const kid = await other.addKid({ name: "Secret Kid" })
    await shell.goto(`/kids/${kid.id}`)
    await expect(page.getByText("Kid not found")).toBeVisible()
    await expect(page.getByText("Secret Kid")).toHaveCount(0)
    await other.dispose()
  })
})
