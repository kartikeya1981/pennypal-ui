import Link from "next/link"

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-bold tracking-tight">
      <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-coin text-lg text-coin-foreground shadow-sm">
        P
      </span>
      <span className="text-lg">
        Penny<span className="text-primary">Pal</span>
      </span>
    </Link>
  )
}
