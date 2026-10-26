import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Coins } from "@/components/coins"
import { EmptyState } from "@/components/empty-state"
import { FormDialog } from "@/components/form-dialog"
import { KidFields } from "@/components/kid-fields"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import { createKid } from "@/lib/actions/kids"
import { ageLabel, earningSchedule, firstName } from "@/lib/format"
import { requireUser } from "@/lib/session"
import type { Kid } from "@/lib/types"

export default async function DashboardPage() {
  const [user, kids] = await Promise.all([requireUser(), api<Kid[]>("/kids")])
  return (
    <>
      <PageHeader title={`Hi ${firstName(user.name)}`} description="Your family's PennyPal accounts">
        <FormDialog title="Add a kid" description="Create a profile for one of your kids" label="Add kid" action={createKid} submitLabel="Save">
          <KidFields />
        </FormDialog>
      </PageHeader>
      {kids.length === 0 ? (
        <EmptyState title="No kids yet" description="Add a profile for each of your kids to start their PennyPal journey." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kids.map((kid) => (
            <li key={kid.id}>
              <Link href={`/kids/${kid.id}`} className="block rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                <Card className="transition-colors hover:bg-muted/40">
                  <CardContent className="flex items-center gap-4">
                    <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl">
                      {kid.avatar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-bold">{kid.name}</p>
                      <p className="text-xs text-muted-foreground">{ageLabel(kid.birthYear)}</p>
                      <p className="mt-1 text-sm">
                        <Coins amount={kid.monthlyEarning} className="text-coin-foreground" /> <span className="text-muted-foreground">/ month</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{earningSchedule(kid.earningDay)}</p>
                    </div>
                    <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
