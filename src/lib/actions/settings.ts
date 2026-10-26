"use server"

import { send } from "./send"
import type { ActionResult } from "./types"

export async function updateProfile(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  return send("/me", "PUT", fd)
}
