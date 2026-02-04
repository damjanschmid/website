import { AnimatedDialog } from "@/components/animated-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AnimatedDialog
        trigger={
          <Card className="w-full max-w-md cursor-pointer shadow-lg transition hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">
                Open placeholder widget
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Click to open a nice animated popup.
              </p>
              <Button>Open</Button>
            </CardContent>
          </Card>
        }
      />
    </div>
  )
}
