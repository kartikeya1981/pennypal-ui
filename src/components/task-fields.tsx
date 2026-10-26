import { Field } from "@/components/field"
import { MAX_TASK_REWARD } from "@/lib/constants"
import { isoDay } from "@/lib/format"
import type { Goal, Task } from "@/lib/types"

export function TaskFields({ task }: { task?: Task }) {
  return (
    <>
      <Field label="Task" name="title" required defaultValue={task?.title} placeholder="e.g. Finish reading a book" full />
      <Field label="Reward (Kid Coins)" name="reward" type="number" min={1} max={MAX_TASK_REWARD} required defaultValue={task?.reward} />
      <Field label="Due date" name="dueDate" type="date" defaultValue={task?.dueDate ? isoDay(task.dueDate) : ""} />
      <Field
        label="Repeat"
        name="recurrence"
        options={[
          { value: "NONE", label: "Never" },
          { value: "WEEKLY", label: "Every week" },
          { value: "MONTHLY", label: "Every month" },
        ]}
        defaultValue={task?.recurrence ?? "NONE"}
        hint="A repeating task comes back once it's approved"
        full
      />
    </>
  )
}

export function RewardDestinationField({ goals: all, defaultValue, hint }: { goals: Goal[]; defaultValue?: string | null; hint: string }) {
  const goals = all.filter((g) => g.status !== "ACHIEVED")
  return (
    <Field
      label="Reward goes to"
      name="rewardGoalId"
      options={[{ value: "", label: "Wallet" }, ...goals.map((g) => ({ value: g.id, label: `${g.emoji} ${g.name}` }))]}
      defaultValue={defaultValue && goals.some((g) => g.id === defaultValue) ? defaultValue : ""}
      hint={hint}
      full
    />
  )
}
