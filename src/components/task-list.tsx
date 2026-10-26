import { Check, Undo2 } from "lucide-react"
import { Coins } from "@/components/coins"
import { DeleteButton } from "@/components/delete-button"
import { FormDialog } from "@/components/form-dialog"
import { RewardDestinationField, TaskFields } from "@/components/task-fields"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { approveTask, deleteTask, rejectTask, submitTask, updateTask } from "@/lib/actions/tasks"
import { coins, taskSchedule } from "@/lib/format"
import { sortTasks } from "@/lib/tasks"
import type { Goal, Task } from "@/lib/types"

export function TaskList({ tasks, goals, kidName }: { tasks: Task[]; goals: Goal[]; kidName: string }) {
  return (
    <ul className="grid grid-cols-1 gap-3">
      {sortTasks(tasks).map((task) => (
        <li key={task.id} className="min-w-0">
          <TaskCard task={task} goals={goals} kidName={kidName} />
        </li>
      ))}
    </ul>
  )
}

function destinationLabel(goals: Goal[], goalId: string | null) {
  const g = goalId ? goals.find((x) => x.id === goalId) : null
  return g ? `${g.emoji} ${g.name}` : "Wallet"
}

function TaskCard({ task, goals, kidName }: { task: Task; goals: Goal[]; kidName: string }) {
  const schedule = taskSchedule(task.dueDate, task.recurrence)
  return (
    <Card aria-label={task.title} role="article" className={task.status === "APPROVED" ? "opacity-75" : undefined}>
      <CardContent className="grid gap-3">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-bold [overflow-wrap:anywhere]">{task.title}</p>
            <p className="text-sm">
              <Coins amount={task.reward} />
              {schedule && <span className="text-muted-foreground"> · {schedule}</span>}
            </p>
          </div>
          {task.status === "SUBMITTED" && <Badge className="bg-amber-500 text-white">Waiting for you</Badge>}
          {task.status === "APPROVED" && <Badge className="bg-emerald-600 text-white">Done</Badge>}
          {task.status !== "APPROVED" && (
            <div className="flex shrink-0 items-center">
              <FormDialog title={`Edit ${task.title}`} mode="edit" action={updateTask.bind(null, task.id)}>
                <TaskFields task={task} />
              </FormDialog>
              <DeleteButton action={deleteTask.bind(null, task.id)} label={`${task.title} task`} />
            </div>
          )}
        </div>
        {task.status === "OPEN" && (
          <div className="flex flex-wrap gap-2">
            <FormDialog
              title="I did it!"
              description={`${kidName} finished “${task.title}” and picks where the ${coins(task.reward)} go.`}
              label="I did it"
              variant="outline"
              icon={<Check />}
              action={submitTask.bind(null, task.id)}
              submitLabel="Mark as done"
              successMessage="Sent for approval"
            >
              <RewardDestinationField goals={goals} hint={`Let ${kidName} choose: the Wallet or one of their goals`} />
            </FormDialog>
          </div>
        )}
        {task.status === "SUBMITTED" && (
          <>
            <p className="text-sm text-muted-foreground">
              {kidName} says it&apos;s done · reward goes to {destinationLabel(goals, task.rewardGoalId)}
            </p>
            <div className="flex flex-wrap gap-2">
              <FormDialog
                title={`Approve “${task.title}”`}
                description={`Pay ${coins(task.reward)} to ${kidName}.`}
                label="Approve"
                icon={<Check />}
                action={approveTask.bind(null, task.id)}
                submitLabel="Approve & pay"
                successMessage="Task reward added"
              >
                <RewardDestinationField goals={goals} defaultValue={task.rewardGoalId} hint={`${kidName}'s choice is picked already`} />
              </FormDialog>
              <form action={rejectTask.bind(null, task.id)}>
                <Button type="submit" size="sm" variant="outline">
                  <Undo2 /> Not yet
                </Button>
              </form>
            </div>
          </>
        )}
        {task.status === "APPROVED" && (
          <p className="text-sm text-muted-foreground">Paid to {destinationLabel(goals, task.rewardGoalId)}</p>
        )}
      </CardContent>
    </Card>
  )
}
