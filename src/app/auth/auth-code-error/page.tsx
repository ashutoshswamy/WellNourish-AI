import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur text-center">
        <CardHeader className="pb-8">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            There was an error confirming your account. This could be due to an
            expired or invalid link.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please try signing up again or contact support if the problem
            persists.
          </p>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/signup">Try Signing Up Again</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Sign In Instead</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
