import type { Task } from "./types"

const ORDER = { SUBMITTED: 0, OPEN: 1, APPROVED: 2 } as const

/** Waiting-for-approval first, then open tasks, then the most recent done ones. */
export function sortTasks(tasks: Task[], doneLimit = 3) {
  const done = tasks.filter((t) => t.status === "APPROVED").slice(0, doneLimit)
  return [...tasks.filter((t) => t.status !== "APPROVED"), ...done].sort((a, b) => ORDER[a.status] - ORDER[b.status])
}
