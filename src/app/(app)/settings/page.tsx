import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/lib/session"
import { ProfileForm } from "./profile-form"

export default async function SettingsPage() {
  const user = await requireUser()
  return (
    <>
      <PageHeader title="Settings" description="Your parent account" />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm name={user.name} />
        </CardContent>
      </Card>
    </>
  )
}
