"use server"

import { remove, send } from "./send"

export async function createGoal(kidId: string, fd: FormData) {
  return send(`/kids/${kidId}/goals`, "POST", fd)
}

export async function updateGoal(goalId: string, fd: FormData) {
  return send(`/goals/${goalId}`, "PUT", fd)
}

export async function deleteGoal(goalId: string) {
  await remove(`/goals/${goalId}`)
}

/** The split form posts goalId + type-{goalId} + value-{goalId} for every goal. */
export async function saveSplit(kidId: string, fd: FormData) {
  const rules = fd.getAll("goalId").map((v) => {
    const goalId = String(v)
    const type = String(fd.get(`type-${goalId}`) ?? "NONE")
    const value = String(fd.get(`value-${goalId}`) ?? "").trim()
    return { goalId, type, value: type === "NONE" || value === "" ? 0 : value }
  })
  return send(`/kids/${kidId}/allocations`, "PUT", { rules })
}

export async function addEarning(kidId: string, fd: FormData) {
  return send(`/kids/${kidId}/earnings`, "POST", fd)
}

/** Real money handed over: debits the Wallet or a goal jar. */
export async function cashOut(kidId: string, fd: FormData) {
  return send(`/kids/${kidId}/payouts`, "POST", fd)
}

export async function moveCoins(kidId: string, fd: FormData) {
  return send(`/kids/${kidId}/transfers`, "POST", fd)
}
