import { test as base, expect, type Page } from "@playwright/test"
import { PennyPalApi } from "./api-client"
import { AppShell } from "./pages/app-shell"

type Fixtures = {
  /** A brand-new parent registered through the API, with an API client for seeding data. */
  api: PennyPalApi
  /** A page already signed in as `api.user` (token cookie injected, no UI login). */
  authedPage: Page
  shell: AppShell
}

export const test = base.extend<Fixtures>({
  api: async ({}, provide) => {
    const api = await PennyPalApi.register()
    await provide(api)
    await api.dispose()
  },
  authedPage: async ({ page, api, baseURL }, provide) => {
    await page.context().addCookies([
      { name: "pp_token", value: api.user.token, url: baseURL!, httpOnly: true, sameSite: "Lax" },
    ])
    // Delete buttons use window.confirm(); accept it by default.
    page.on("dialog", (d) => d.accept())
    await provide(page)
  },
  shell: async ({ authedPage }, provide) => {
    await provide(new AppShell(authedPage))
  },
})

export { expect }
