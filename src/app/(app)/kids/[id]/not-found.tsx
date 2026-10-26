import Link from "next/link"
import { EmptyState } from "@/components/empty-state"
import { buttonVariants } from "@/components/ui/button"

export default function KidNotFound() {
  return (
    <div className="grid gap-4">
      <EmptyState title="Kid not found" description="This profile doesn't exist or belongs to another family." />
      <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "justify-self-center" })}>
        Back to family
      </Link>
    </div>
  )
}
