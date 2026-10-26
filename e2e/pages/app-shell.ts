import { expect, type Locator, type Page } from "@playwright/test"

export const NAV_ITEMS = [
  ["Family", "/dashboard"],
  ["Settings", "/settings"],
] as const

/** Layout shared by every signed-in page: sidebar (desktop) or bottom tab bar (phone), user info and sign-out. */
export class AppShell {
  constructor(readonly page: Page) {}

  nav(): Locator {
    return this.page.getByRole("navigation", { name: "Main" }).filter({ visible: true })
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  async navigate(label: string) {
    await this.nav().getByRole("link", { name: label, exact: true }).click()
  }

  heading(): Locator {
    return this.page.getByRole("heading", { level: 1 })
  }

  async signOut() {
    await this.page.getByRole("button", { name: "Sign out" }).filter({ visible: true }).first().click()
  }

  async expectToast(text: string | RegExp) {
    await expect(this.page.locator("[data-sonner-toast]").filter({ hasText: text }).first()).toBeVisible()
  }
}
