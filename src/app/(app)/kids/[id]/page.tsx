import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Coins } from "@/components/coins"
import { DeleteButton } from "@/components/delete-button"
import { FormDialog } from "@/components/form-dialog"
import { KidFields } from "@/components/kid-fields"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiError, api } from "@/lib/api"
import { deleteKid, updateKid } from "@/lib/actions/kids"
import { ageLabel, earningSchedule } from "@/lib/format"
import type { Kid } from "@/lib/types"

async function getKid(id: string) {
  try {
    return await api<Kid>(`/kids/${id}`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound()
    throw e
  }
}

export default async function KidPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const kid = await getKid(id)
  return (
    <>
      <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Family
      </Link>
      <div className="mb-6 flex items-center gap-4">
        <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-4xl">
          {kid.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{kid.name}</h1>
          <p className="text-sm text-muted-foreground">{ageLabel(kid.birthYear)}</p>
        </div>
        <div className="flex items-center gap-1">
          <FormDialog title="Edit profile" mode="edit" action={updateKid.bind(null, kid.id)}>
            <KidFields kid={kid} />
          </FormDialog>
          <DeleteButton action={deleteKid.bind(null, kid.id)} label={`${kid.name}'s profile`} />
        </div>
      </div>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Monthly Earning</CardTitle>
          <CardDescription>Credited to {kid.name}&apos;s account {earningSchedule(kid.earningDay)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Coins amount={kid.monthlyEarning} className="text-2xl text-coin-foreground" />
        </CardContent>
      </Card>
    </>
  )
}
