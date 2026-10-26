import { cache } from "react"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"

export const requireUser = cache(() => api<User>("/me"))
