import type { Task } from "./types"

const ORDER = { SUBMITTED: 0, OPEN: 1, APPROVED: 2 } as const

/** Waiting-for-approval first, then open tasks, then the most recently approved ones. */
export function sortTasks(tasks: Task[], doneLimit = 3) {
  const approvedAt = (t: Task) => (t.approvedAt ? new Date(t.approvedAt).getTime() : 0)
  const done = tasks
    .filter((t) => t.status === "APPROVED")
    .sort((a, b) => approvedAt(b) - approvedAt(a))
    .slice(0, doneLimit)
  return [...tasks.filter((t) => t.status !== "APPROVED"), ...done].sort((a, b) => ORDER[a.status] - ORDER[b.status])
}
