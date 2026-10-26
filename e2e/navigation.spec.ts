import { expect, test } from "./fixtures"
import { NAV_ITEMS } from "./pages/app-shell"

test.describe("app shell", () => {
  test("navigates between sections @mobile", async ({ shell, authedPage: page }) => {
    await shell.goto("/dashboard")
    for (const [label, path] of [...NAV_ITEMS].reverse()) {
      await shell.navigate(label)
      await expect(page).toHaveURL(new RegExp(`${path}$`))
      await expect(shell.nav().getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page")
    }
  })

  test("updates the parent's name in settings", async ({ shell, authedPage: page }) => {
    await shell.goto("/settings")
    await page.getByLabel("Name").fill("Priya Sharma")
    await page.getByRole("button", { name: "Save profile" }).click()
    await shell.expectToast("Profile updated")
    await shell.navigate("Family")
    await expect(page.getByRole("heading", { name: "Hi Priya" })).toBeVisible()
  })
})

test.describe("mobile layout", () => {
  test("uses a bottom tab bar on phones and fits the screen width @mobile", async ({ api, shell, authedPage: page, isMobile }) => {
    test.skip(!isMobile, "phone-only layout checks")
    const kid = await api.addKid({ name: "1234567890".repeat(4) })
    for (const path of ["/dashboard", `/kids/${kid.id}`, "/settings"]) {
      await shell.goto(path)
      const nav = shell.nav()
      await expect(nav).toHaveCount(1)
      const box = (await nav.boundingBox())!
      const viewport = page.viewportSize()!
      expect(box.y + box.height).toBeCloseTo(viewport.height, 0)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    }
  })

  test("uses the sidebar on desktop", async ({ shell, isMobile }) => {
    test.skip(isMobile, "desktop-only layout check")
    await shell.goto("/dashboard")
    const box = (await shell.nav().boundingBox())!
    expect(box.x).toBeLessThan(250)
    expect(box.y).toBeLessThan(200)
  })
})
