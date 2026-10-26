export type User = {
  id: string
  name: string
  email: string
  createdAt: Date
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
