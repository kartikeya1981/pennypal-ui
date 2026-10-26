"use server"

import { remove, send } from "./send"

export async function createTask(kidId: string, fd: FormData) {
  return send(`/kids/${kidId}/tasks`, "POST", fd)
}

export async function updateTask(taskId: string, fd: FormData) {
  return send(`/tasks/${taskId}`, "PUT", fd)
}

export async function deleteTask(taskId: string) {
  await remove(`/tasks/${taskId}`)
}

/** Kid says "I did it" and picks the Wallet or a goal. */
export async function submitTask(taskId: string, fd: FormData) {
  return send(`/tasks/${taskId}/submit`, "POST", fd)
}

export async function approveTask(taskId: string, fd: FormData) {
  return send(`/tasks/${taskId}/approve`, "POST", fd)
}

export async function rejectTask(taskId: string) {
  const result = await send(`/tasks/${taskId}/reject`, "POST")
  if (!result.ok) throw new Error(result.error)
}
