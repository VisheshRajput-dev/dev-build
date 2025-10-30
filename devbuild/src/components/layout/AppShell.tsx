import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoPng from "@/assets/logo.png";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh grid grid-rows-[56px_1fr]">
      <header className="border-b backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/90">
        <div className="h-14 max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-sm">
              <img src={logoPng} alt="Logo" className="h-7 w-7 object-contain" />
            </span>
            <span className="font-semibold">RealDesk</span>
          </Link>
          <nav className="hidden md:flex items-center gap-3 text-sm">
            <TopNavItem to="/app/tasks" label="Tasks" />
            <TopNavItem to="/app/inbox" label="Inbox" />
            <TopNavItem to="/app/history" label="History" />
            <TopNavItem to="/app/profile" label="Profile" />
          </nav>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block border-r p-4 space-y-4 bg-sidebar">
          <nav className="grid gap-1 text-sm">
            <NavItem to="/app/dashboard" label="Dashboard" />
            <NavItem to="/app/tasks" label="Tasks" />
            <NavItem to="/app/inbox" label="Inbox" />
            <NavItem to="/app/history" label="History" />
            <NavItem to="/app/profile" label="Profile" />
          </nav>
        </aside>
        <main className="min-h-svh p-2 md:p-4">{children}</main>
      </div>
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

function TopNavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-3 py-1.5 rounded-md hover:bg-accent transition-colors",
          isActive && "bg-accent text-accent-foreground"
        )
      }
    >
      {label}
    </NavLink>
  );
}


