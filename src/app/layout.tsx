import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] })

export const metadata: Metadata = {
  applicationName: "PennyPal",
  title: "PennyPal — Money skills for kids",
  description: "A parent-managed app that helps kids earn, save towards goals and spend wisely with Kid Coins.",
  appleWebApp: { capable: true, title: "PennyPal", statusBarStyle: "default" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6d4aff",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={nunito.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
