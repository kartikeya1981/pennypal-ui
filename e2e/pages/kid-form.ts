import { expect, type Locator, type Page } from "@playwright/test"

export type KidValues = Partial<{ name: string; avatar: string; birthYear: number | string; monthlyEarning: number | string; earningDay: number }>

/** The add / edit kid dialog (components/form-dialog.tsx + components/kid-fields.tsx). */
export class KidForm {
  constructor(readonly page: Page) {}

  root(): Locator {
    return this.page.getByRole("dialog")
  }

  async fill(v: KidValues) {
    const root = this.root()
    if (v.name !== undefined) await root.getByLabel("Name").fill(v.name)
    if (v.avatar !== undefined) {
      const label = `Avatar ${v.avatar}`
      await root.locator("label").filter({ has: this.page.getByLabel(label, { exact: true }) }).click()
      const radio = root.getByLabel(label, { exact: true })
      await expect(radio).toBeChecked()
    }
    if (v.birthYear !== undefined) await root.getByLabel("Birth year").fill(String(v.birthYear))
    if (v.monthlyEarning !== undefined) await root.getByLabel("Monthly earning (Kid Coins)").fill(String(v.monthlyEarning))
    if (v.earningDay !== undefined) await root.getByLabel("Earning day").selectOption(String(v.earningDay))
  }

  async save() {
    await this.root().getByRole("button", { name: "Save" }).click()
  }

  async submit(v: KidValues) {
    await this.fill(v)
    await this.save()
    await expect(this.root()).toBeHidden()
  }

  error(): Locator {
    return this.root().locator("p.text-destructive")
  }
}
