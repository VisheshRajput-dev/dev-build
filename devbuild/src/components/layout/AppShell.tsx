import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoPng from "@/assets/logo.png";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh grid grid-cols-1 lg:grid-cols-[220px_1fr]">
      <aside className="border-r p-4 space-y-6 bg-sidebar/60 backdrop-blur">
        <Link to="/app/dashboard" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-sm">
            <img src={logoPng} alt="Logo" className="h-7 w-7 object-contain" />
          </span>
          <span className="font-semibold">RealDesk</span>
        </Link>
        <nav className="grid gap-1 text-sm">
          <NavItem to="/app/dashboard" label="Dashboard" />
          <NavItem to="/app/tasks" label="Tasks" />
          <NavItem to="/app/inbox" label="Inbox" />
          <NavItem to="/app/history" label="History" />
          <NavItem to="/app/profile" label="Profile" />
        </nav>
      </aside>
      <main className="min-h-svh p-3 md:p-6">{children}</main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 rounded-md hover:bg-accent transition-colors",
          isActive && "bg-accent text-accent-foreground"
        )
      }
    >
      {label}
    </NavLink>
  );
}

// top nav removed


