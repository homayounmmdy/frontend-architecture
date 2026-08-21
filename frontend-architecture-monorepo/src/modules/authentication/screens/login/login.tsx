import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../../providers/use-auth";
import { ThemeToggle } from "@/app/shell/theme-toggle";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const DEMO_PASSWORD = "demo123";

const demoUsers = [
  { email: "owner@northstar.demo", label: "Cross-account owner" },
  { email: "admin@northstar.demo", label: "Northstar admin" },
  { email: "user@atelier.demo", label: "Atelier user" },
];

export default function LoginPage() {
  const { isAuthenticated, login, getFallbackPath } = useAuth();
  const [email, setEmail] = useState(demoUsers[0].email);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={getFallbackPath()} />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(43,108,176,0.14),_transparent_40%),linear-gradient(180deg,_rgba(15,23,42,0.03),_transparent)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_36%),linear-gradient(180deg,_rgba(15,23,42,0.44),_rgba(2,6,23,0.88))]">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border bg-card p-8 shadow-panel">
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">CommerceOS</div>
            <h1 className="max-w-md text-4xl font-semibold tracking-tight">Tenant-aware auth for the fake admin app.</h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Sign in with a seeded user to test protected routes, account switching, role-based permissions, and account-scoped data.
            </p>
          </div>
          <div className="mt-8 grid gap-3">
            {demoUsers.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => {
                  setEmail(user.email);
                  setPassword(DEMO_PASSWORD);
                }}
                className="rounded-xl border px-4 py-3 text-left transition-colors hover:bg-accent"
              >
                <div className="font-medium">{user.label}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </button>
            ))}
          </div>
        </div>

        <Card className="rounded-2xl shadow-panel">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                setError(null);
                setIsSubmitting(true);
                try {
                  await login({ email, password });
                } catch (cause) {
                  setError(cause instanceof Error ? cause.message : "Login failed");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                Demo password for all seeded users: <span className="font-medium text-foreground">{DEMO_PASSWORD}</span>
              </div>
              {error ? <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div> : null}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
