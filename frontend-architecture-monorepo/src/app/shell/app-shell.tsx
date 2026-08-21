import { type ReactNode, useEffect, useState } from "react";
import { Command, Menu, Search } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/modules/authentication/providers/use-auth";
import { CommandMenu } from "./command-menu";
import { SidebarNav } from "./sidebar-nav";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { navItems } from "./nav-items";
import { ROLE_LABELS } from "@/modules/users/lib/permissions";

function getPageTitle(pathname: string) {
  if (pathname === "/") return "Dashboard";
  const matched = navItems.find((item) => item.to !== "/" && pathname.startsWith(item.to));
  return matched?.label ?? "CommerceOS Admin";
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const { session, switchAccount } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandMenuOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-background">
      <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      <div className="flex h-full">
        <aside className="hidden h-full w-72 overflow-y-auto border-r bg-card p-4 lg:block">
          <SidebarNav />
        </aside>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="lg:hidden">
                  <SidebarNav />
                </SheetContent>
              </Sheet>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-muted-foreground">CommerceOS Admin</div>
                <div className="truncate text-lg font-semibold">{getPageTitle(pathname)}</div>
              </div>
              {session ? (
                <div className="hidden min-w-[220px] lg:block">
                  <Select
                    value={session.activeAccount.id}
                    onChange={(event) => void switchAccount(event.target.value)}
                    aria-label="Active account"
                  >
                    {session.memberships.map((membership) => (
                      <option key={membership.account.id} value={membership.account.id}>
                        {membership.account.name} · {ROLE_LABELS[membership.role]}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : null}
              <ThemeToggle />
              <Button
                type="button"
                variant="outline"
                onClick={() => setCommandMenuOpen(true)}
                className="hidden w-full max-w-sm items-center justify-between gap-3 md:flex"
              >
                <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span className="truncate">Search, jump, or run a command...</span>
                </span>
                <span className="flex items-center gap-1 rounded-md border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </span>
              </Button>
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
