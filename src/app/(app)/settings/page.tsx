import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/lib/session"
import { KidModePinForm } from "./kid-mode-pin-form"
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
      <Card className="mt-6 max-w-xl" aria-label="Kid Mode PIN" role="region">
        <CardHeader>
          <CardTitle>Kid Mode PIN</CardTitle>
          <CardDescription>
            {user.hasKidModePin
              ? "PIN is set. You need it to leave Kid Mode."
              : "Not set yet. Kid Mode lets your kid use PennyPal on your device; this PIN is needed to leave it."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KidModePinForm hasPin={user.hasKidModePin} />
        </CardContent>
      </Card>
    </>
  )
}
