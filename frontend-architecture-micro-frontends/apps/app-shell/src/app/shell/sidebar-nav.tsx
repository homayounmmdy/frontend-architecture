import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { CircleUserRound, EllipsisVertical, LogOut, Store } from "lucide-react";
import { useAuth } from "@commerceos/authentication/providers/use-auth";
import { navItems } from "./nav-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@commerceos/ui/dropdown-menu";
import { cn } from "@commerceos/ui/lib/utils";
import { ROLE_LABELS } from "@commerceos/shared/permissions/permissions";

export function SidebarNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const { session, hasPermission, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-4">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold">CommerceOS</div>
          <div className="text-xs text-muted-foreground">
            {session ? `${session.activeAccount.name} · ${ROLE_LABELS[session.activeRole]}` : "Admin"}
          </div>
        </div>
      </div>
      <nav className="mt-4 flex-1 space-y-1">
        {navItems.filter((item) => hasPermission(item.permission)).map((item) => {
          const isActive = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                isActive && "bg-accent text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {session ? (
        <div className="rounded-xl border bg-card p-2 shadow-sm">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            {session.user.avatarUrl ? (
              <img src={session.user.avatarUrl} alt={session.user.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-semibold">
                {session.user.initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{session.user.name}</div>
              <div className="truncate text-sm text-muted-foreground">{session.user.email}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <EllipsisVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-3">
                  {session.user.avatarUrl ? (
                    <img src={session.user.avatarUrl} alt={session.user.name} className="h-10 w-10 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-sm font-semibold">
                      {session.user.initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold leading-none">{session.user.name}</div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{session.user.email}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void navigate({ to: "/profile" })}>
                  <CircleUserRound className="h-4 w-4 text-muted-foreground" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void logout()}>
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="px-2 pb-1 text-xs text-muted-foreground">
            {session.activeAccount.name} · {ROLE_LABELS[session.activeRole]}
          </div>
        </div>
      ) : null}
    </div>
  );
}
