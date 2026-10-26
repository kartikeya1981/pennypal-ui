import { expect, test } from "./fixtures"

test.describe("Tasks", () => {
  test("parent adds a task, kid picks a goal, parent approves and the reward lands there @mobile", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid({ name: "Aarav" })
    const bike = await api.addGoal(kid.id, { name: "Bike", emoji: "🚲", targetAmount: 100 })
    await shell.goto(`/kids/${kid.id}`)
    const dialog = page.getByRole("dialog")

    await page.getByRole("button", { name: "Add task" }).click()
    await dialog.getByLabel("Task").fill("Finish reading a book")
    await dialog.getByLabel("Reward (Kid Coins)").fill("60")
    await dialog.getByLabel("Repeat").selectOption("WEEKLY")
    await dialog.getByRole("button", { name: "Save" }).click()
    await expect(dialog).toBeHidden()
    const card = page.getByRole("article", { name: "Finish reading a book" })
    await expect(card).toContainText("60 Kid Coins · Repeats weekly")

    await card.getByRole("button", { name: "I did it" }).click()
    await dialog.getByLabel("Reward goes to").selectOption({ label: "🚲 Bike" })
    await dialog.getByRole("button", { name: "Mark as done" }).click()
    await expect(dialog).toBeHidden()
    await expect(card).toContainText("Waiting for you")
    await expect(card).toContainText("reward goes to 🚲 Bike")

    await card.getByRole("button", { name: "Approve" }).click()
    await expect(dialog.getByLabel("Reward goes to")).toHaveValue(bike.id)
    await dialog.getByRole("button", { name: "Approve & pay" }).click()
    await expect(dialog).toBeHidden()

    await expect(page.getByRole("region", { name: "Balance" })).toContainText("60 Kid Coins")
    await expect(page.getByRole("article", { name: "Bike" })).toContainText("60 Kid Coins of 100 Kid Coins")
    await expect(page.getByRole("region", { name: "Balance" }).getByLabel("Saved in goals")).toContainText("60 Kid Coins")
    await expect(page.getByText("Task reward · Finish reading a book").first()).toBeVisible()
    // The weekly task comes back for next time, and the done one shows where it was paid
    await expect(card).toHaveCount(2)
    await expect(card.filter({ hasText: "Done" })).toContainText("Paid to 🚲 Bike")
    await expect(card.filter({ hasText: "I did it" })).toHaveCount(1)
  })

  test("parent can send a task back, and the Wallet is the default destination @mobile", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid({ name: "Meera" })
    await api.addTask(kid.id, { title: "Water the plants", reward: 20 })
    await shell.goto(`/kids/${kid.id}`)
    const dialog = page.getByRole("dialog")
    const card = page.getByRole("article", { name: "Water the plants" })

    await card.getByRole("button", { name: "I did it" }).click()
    await expect(dialog.getByLabel("Reward goes to")).toHaveValue("")
    await dialog.getByRole("button", { name: "Mark as done" }).click()
    await expect(card).toContainText("reward goes to Wallet")
    await card.getByRole("button", { name: "Not yet" }).click()
    await expect(card).not.toContainText("Waiting for you")
    await expect(card.getByRole("button", { name: "I did it" })).toBeVisible()

    await card.getByRole("button", { name: "I did it" }).click()
    await dialog.getByRole("button", { name: "Mark as done" }).click()
    await card.getByRole("button", { name: "Approve" }).click()
    await dialog.getByRole("button", { name: "Approve & pay" }).click()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole("region", { name: "Balance" }).getByLabel("Wallet balance")).toContainText("20 Kid Coins")
    await expect(card).toContainText("Paid to Wallet")
  })

  test("keeps typed values when the API rejects a task, and long titles fit on a phone @mobile", async ({ api, shell, authedPage: page }) => {
    const kid = await api.addKid()
    const long = "W".repeat(60)
    await api.addTask(kid.id, { title: long, reward: 1_00_000 })
    await shell.goto(`/kids/${kid.id}`)
    await expect(page.getByRole("article", { name: long })).toContainText("1,00,000 Kid Coins")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

    const dialog = page.getByRole("dialog")
    await page.getByRole("button", { name: "Add task" }).click()
    await dialog.getByLabel("Task").fill("x".repeat(61))
    await dialog.getByLabel("Reward (Kid Coins)").fill("15")
    await dialog.getByRole("button", { name: "Save" }).click()
    await expect(dialog.getByRole("alert")).toBeVisible()
    await expect(dialog.getByLabel("Task")).toHaveValue("x".repeat(61))
    await expect(dialog.getByLabel("Reward (Kid Coins)")).toHaveValue("15")
  })
})
