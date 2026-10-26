export type User = {
  id: string
  name: string
  email: string
  createdAt: Date
  /** Whether a Kid Mode PIN has been set. */
  hasKidModePin: boolean
}

export type Kid = {
  id: string
  parentId: string
  name: string
  avatar: string
  birthYear: number
  /** Whole Kid Coins credited every month as an Earning. */
  monthlyEarning: number
  /** Day of the month (1-31); shorter months use their last day. */
  earningDay: number
  createdAt: Date
  updatedAt: Date
}

export type KidWithBalance = Kid & { balance: number }

export type AllocationType = "NONE" | "PERCENT" | "FIXED"

export type Goal = {
  id: string
  kidId: string
  name: string
  emoji: string
  targetAmount: number
  /** READY once the jar reaches the target; ACHIEVED once the full jar was cashed out. */
  status: "ACTIVE" | "READY" | "ACHIEVED"
  /** Share of each Monthly Earning moved into this goal's jar. */
  allocationType: AllocationType
  allocationValue: number
  /** Kid Coins currently in this goal's jar. */
  balance: number
}

export type Account = {
  total: number
  /** Kid Coins not in any goal ("free to use"). */
  wallet: number
  goals: Goal[]
  /** Months ("2026-10") whose Monthly Earning has been added. */
  creditedMonths: string[]
  currentMonth: string
}

export type SplitPreview = { shares: { goalId: string; amount: number }[]; wallet: number }

export type StatementLeg = { goalId: string | null; goalName: string | null; goalEmoji: string | null; amount: number }

export type StatementRow = {
  id: string
  type: "MONTHLY_EARNING" | "EXTRA_EARNING" | "TASK_EARNING" | "TRANSFER" | "PAYOUT"
  note: string | null
  createdAt: Date
  /** Net change to the kid's total balance. */
  amount: number
  balanceAfter: number
  /** Net change per pot (Wallet or goal jar). */
  legs: StatementLeg[]
}

export type TaskRecurrence = "NONE" | "WEEKLY" | "MONTHLY"
export type TaskStatus = "OPEN" | "SUBMITTED" | "APPROVED"

export type Task = {
  id: string
  kidId: string
  title: string
  reward: number
  dueDate: string | Date | null
  recurrence: TaskRecurrence
  status: TaskStatus
  /** Where the reward goes: a goal id, or null for the Wallet. */
  rewardGoalId: string | null
  submittedAt: string | Date | null
  approvedAt: string | Date | null
  createdAt: string | Date
}

export type KidBadge = {
  code: string
  emoji: string
  name: string
  description: string
  /** null until the kid earns it. */
  earnedAt: Date | null
}
