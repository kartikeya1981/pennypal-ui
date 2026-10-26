import { expect, test } from "@playwright/test"

test.describe("installable web app", () => {
  test("links a web manifest with PennyPal icons @mobile", async ({ page, request }) => {
    await page.goto("/")
    const href = await page.locator('link[rel="manifest"]').getAttribute("href")
    expect(href).toBeTruthy()
    const manifest = await (await request.get(href!)).json()
    expect(manifest).toMatchObject({ short_name: "PennyPal", display: "standalone", start_url: "/dashboard" })
    for (const icon of manifest.icons as { src: string }[]) {
      const res = await request.get(icon.src)
      expect(res.status(), icon.src).toBe(200)
      expect(res.headers()["content-type"]).toBe("image/png")
    }
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#6d4aff")
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1)
  })
})
