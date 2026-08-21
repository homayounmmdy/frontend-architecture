import { Outlet } from "@tanstack/react-router";

export function StandaloneRoot() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto w-full max-w-7xl">
        <Outlet />
      </div>
    </main>
  );
}
