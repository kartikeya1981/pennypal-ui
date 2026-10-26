import { expect, test } from "@playwright/test"
import { PennyPalApi, uniqueEmail } from "./api-client"
import { LoginPage, RegisterPage } from "./pages/auth-pages"

test.describe("landing page", () => {
  test("shows the hero with sign in / sign up links @mobile", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Little savers")
    await page.getByRole("link", { name: "Get started" }).click()
    await expect(page).toHaveURL(/\/register$/)
    await page.goto("/")
    await page.getByRole("link", { name: "Sign in" }).first().click()
    await expect(page).toHaveURL(/\/login$/)
  })
})

test.describe("registration", () => {
  test("creates a parent account and lands on the family dashboard @mobile", async ({ page }) => {
    const register = new RegisterPage(page)
    await register.goto()
    await register.register("Asha Verma", uniqueEmail("signup"), "password123")
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole("heading", { name: "Hi Asha" })).toBeVisible()
    await expect(page.getByText("No kids yet")).toBeVisible()
  })

  test("rejects an email that is already registered", async ({ page }) => {
    const existing = await PennyPalApi.register()
    const register = new RegisterPage(page)
    await register.goto()
    await register.register("Someone Else", existing.user.email.toUpperCase(), "password123")
    await expect(register.error()).toHaveText("An account with this email already exists")
    await expect(page).toHaveURL(/\/register$/)
    await existing.dispose()
  })

  test("rejects a password shorter than 8 characters", async ({ page }) => {
    const register = new RegisterPage(page)
    await register.goto()
    // Bypass the browser's minLength check to exercise API validation.
    await page.getByLabel("Password").evaluate((el) => el.removeAttribute("minlength"))
    await register.register("Short Pass", uniqueEmail("short"), "short")
    await expect(register.error()).toContainText("at least 8 characters")
  })
})

test.describe("login and logout", () => {
  test("signs in with valid credentials and signs out again @mobile", async ({ page }) => {
    const api = await PennyPalApi.register("Ravi Kumar")
    const login = new LoginPage(page)
    await login.goto()
    await login.login(api.user.email, api.user.password)
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole("heading", { name: "Hi Ravi" })).toBeVisible()

    await page.getByRole("button", { name: "Sign out" }).filter({ visible: true }).first().click()
    await expect(page).toHaveURL(/\/$/)
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/login/)
    await api.dispose()
  })

  test("shows an error for a wrong password and keeps the email", async ({ page }) => {
    const api = await PennyPalApi.register()
    const login = new LoginPage(page)
    await login.goto()
    await login.login(api.user.email, "wrong-password")
    await expect(login.error()).toHaveText("Invalid email or password")
    await expect(page.getByLabel("Email")).toHaveValue(api.user.email)
    await api.dispose()
  })

  test("signed-in parents visiting / are sent to the dashboard", async ({ page, baseURL }) => {
    const api = await PennyPalApi.register()
    await page.context().addCookies([{ name: "pp_token", value: api.user.token, url: baseURL! }])
    await page.goto("/")
    await expect(page).toHaveURL(/\/dashboard$/)
    await api.dispose()
  })

  test("protected pages redirect to login without a session, or with a bad one", async ({ page, baseURL }) => {
    for (const path of ["/dashboard", "/settings", "/kids/anything"]) {
      await page.goto(path)
      await expect(page).toHaveURL(/\/login$/)
    }
    await page.context().addCookies([{ name: "pp_token", value: "garbage", url: baseURL! }])
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/login$/)
  })
})
