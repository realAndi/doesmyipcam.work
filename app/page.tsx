import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Grid } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">Monitor your IP cameras from anywhere.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>View and manage your cameras</CardDescription>
          
          <div className="mt-4">
            <Button asChild className="w-full">
              <Link href="/cameras" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                View All Cameras
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
