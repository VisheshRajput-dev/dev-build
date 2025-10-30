import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh grid grid-cols-[220px_1fr]">
      <aside className="border-r p-4 space-y-4">
        <Link to="/app/dashboard" className="block font-bold text-lg">RealDesk</Link>
        <nav className="grid gap-1 text-sm">
          <NavItem to="/app/dashboard" label="Dashboard" />
          <NavItem to="/app/tasks" label="Tasks" />
          <NavItem to="/app/inbox" label="Inbox" />
          <NavItem to="/app/history" label="History" />
          <NavItem to="/app/profile" label="Profile" />
        </nav>
      </aside>
      <main className="min-h-svh">{children}</main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 rounded-md hover:bg-accent",
          isActive && "bg-accent text-accent-foreground"
        )
      }
    >
      {label}
    </NavLink>
  );
}


