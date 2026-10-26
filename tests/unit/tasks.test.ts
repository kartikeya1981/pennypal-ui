import { describe, expect, it } from "vitest"
import { entryTitle, isoDay, taskSchedule } from "@/lib/format"
import { sortTasks } from "@/lib/tasks"
import type { Task } from "@/lib/types"

const task = (id: string, status: Task["status"]): Task => ({
  id,
  kidId: "k",
  title: id,
  reward: 1,
  dueDate: null,
  recurrence: "NONE",
  status,
  rewardGoalId: null,
  submittedAt: null,
  approvedAt: null,
  createdAt: new Date(),
})

describe("tasks", () => {
  it("sorts waiting tasks first and keeps only recent done ones", () => {
    const list = [task("d1", "APPROVED"), task("o1", "OPEN"), task("d2", "APPROVED"), task("s1", "SUBMITTED"), task("d3", "APPROVED"), task("d4", "APPROVED")]
    expect(sortTasks(list).map((t) => t.id)).toEqual(["s1", "o1", "d1", "d2", "d3"])
    expect(sortTasks(list, 1).map((t) => t.id)).toEqual(["s1", "o1", "d1"])
  })

  it("shows the most recently approved tasks, whatever order they were created in", () => {
    const at = (id: string, approvedAt: string) => ({ ...task(id, "APPROVED"), approvedAt })
    const list = [at("a", "2026-10-04"), at("b", "2026-10-01"), at("c", "2026-10-02"), at("d", "2026-10-03")]
    expect(sortTasks(list).map((t) => t.id)).toEqual(["a", "d", "c"])
  })

  it("describes due dates and repeats", () => {
    expect(taskSchedule("2026-10-31T00:00:00.000Z", "WEEKLY")).toBe("Due 31 Oct · Repeats weekly")
    expect(taskSchedule(null, "MONTHLY")).toBe("Repeats monthly")
    expect(taskSchedule(null, "NONE")).toBe("")
    expect(isoDay(new Date("2026-03-03T00:00:00Z"))).toBe("2026-03-03")
  })

  it("titles task rewards on the statement", () => {
    expect(entryTitle("TASK_EARNING", "Tidy room")).toBe("Task reward · Tidy room")
  })
})
