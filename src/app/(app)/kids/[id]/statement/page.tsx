import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/page-header"
import { StatementList } from "@/components/statement-list"
import { api } from "@/lib/api"
import { getKidOr404 } from "@/lib/kids"
import type { StatementRow } from "@/lib/types"

export default async function StatementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const kid = await getKidOr404(id)
  const rows = await api<StatementRow[]>(`/kids/${id}/statement`)
  return (
    <>
      <Link href={`/kids/${kid.id}`} className="mb-4 inline-flex max-w-full items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 shrink-0" /> <span className="truncate">{kid.name}</span>
      </Link>
      <PageHeader title={`${kid.name}'s statement`} description="Every Kid Coin added or moved, newest first" />
      {rows.length ? (
        <StatementList rows={rows} />
      ) : (
        <EmptyState title="No entries yet" description="Earnings and moves between goals will show up here." />
      )}
    </>
  )
}
