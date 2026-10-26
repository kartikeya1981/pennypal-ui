import type { Page } from "@playwright/test"

export class LoginPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto("/login")
  }

  async login(email: string, password: string) {
    await this.page.getByLabel("Email").fill(email)
    await this.page.getByLabel("Password").fill(password)
    await this.page.getByRole("button", { name: "Sign in" }).click()
  }

  error() {
    return this.page.locator("form p.text-destructive")
  }
}

export class RegisterPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto("/register")
  }

  async register(name: string, email: string, password: string) {
    await this.page.getByLabel("Name").fill(name)
    await this.page.getByLabel("Email").fill(email)
    await this.page.getByLabel("Password").fill(password)
    await this.page.getByRole("button", { name: "Create account" }).click()
  }

  error() {
    return this.page.locator("form p.text-destructive")
  }
}
