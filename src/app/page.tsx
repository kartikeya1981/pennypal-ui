import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { HandCoins, ListChecks, ReceiptText, Target, Users, Wallet } from "lucide-react"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { TOKEN_COOKIE } from "@/lib/api"

const FEATURES = [
  { icon: Users, title: "A profile for every kid", text: "Parents run the accounts, so kids learn without needing a phone of their own." },
  { icon: Wallet, title: "Monthly Earnings", text: "Turn pocket money into an Earning of Kid Coins that arrives on the same day every month." },
  { icon: Target, title: "Goals worth saving for", text: "A video game, a tennis racket, new shoes: set goals together and watch the jars fill up." },
  { icon: ListChecks, title: "Extra tasks, extra coins", text: "Reading a book or helping with chores earns bonus Kid Coins." },
  { icon: HandCoins, title: "Real rewards", text: "When a goal is reached, hand over real money and record it as a payout." },
  { icon: ReceiptText, title: "A clear statement", text: "Every coin in and out shows up on their statement, just like a real bank account." },
]

export default async function Home() {
  if ((await cookies()).has(TOKEN_COOKIE)) redirect("/dashboard")
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-2 p-4">
        <Logo />
        <div className="flex gap-2">
          <Link href="/login" className={buttonVariants({ variant: "ghost" })}>Sign in</Link>
          <Link href="/register" className={buttonVariants()}>Get started</Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
        <p className="text-5xl" aria-hidden>🪙🐷🎯</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
          Little savers, <span className="text-primary">big goals.</span>
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          PennyPal helps parents teach kids under 18 how to earn, save and spend wisely using virtual Kid Coins.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>Create a family account</Link>
          <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>Sign in</Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border bg-background p-5">
            <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
              <Icon className="size-5" />
            </div>
            <h2 className="font-bold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
