"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "./material-icon";

type NavItem = {
  href: string;
  icon: string;
  label: string;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/roster", icon: "group", label: "Roster" },
  { href: "/schedule", icon: "event_note", label: "Schedule" },
  { href: "/social", icon: "share", label: "Social Assets" },
  { href: "/stats", icon: "analytics", label: "Team Stats" },
];

const SECONDARY_NAV: NavItem[] = [
  { href: "/support", icon: "help", label: "Support" },
  { href: "/logout", icon: "logout", label: "Logout" },
];

export function SideNav() {
  const pathname = usePathname();

  const renderItem = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname?.startsWith(`${item.href}/`);

    const baseClasses =
      "px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-300 active:scale-95";
    const stateClasses = isActive
      ? "bg-red-600/10 text-red-500 border-r-2 border-red-600"
      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5";

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`${baseClasses} ${stateClasses}`}
      >
        <MaterialIcon name={item.icon} />
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-40 border-r border-white/5 bg-zinc-950/80 backdrop-blur-2xl shadow-[20px_0_50px_rgba(0,0,0,0.5)] pt-20 pb-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center overflow-hidden">
          <MaterialIcon name="sports_rugby" className="text-red-600" />
        </div>
        <div>
          <h2 className="text-on-background font-display-title-xs text-display-title-xs leading-tight">
            First XV
          </h2>
          <p className="text-muted-foreground font-subtitle-xs text-[11px]">
            Elite Division
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1 px-2 font-sans font-medium text-sm">
        {PRIMARY_NAV.map(renderItem)}
      </div>

      <div className="px-6 my-4">
        <button
          type="button"
          className="w-full py-2.5 rounded-lg border border-red-600/30 text-red-500 hover:bg-red-600/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <MaterialIcon name="add" size={18} />
          New Match
        </button>
      </div>

      <div className="flex flex-col gap-1 px-2 font-sans font-medium text-sm border-t border-white/5 pt-4">
        {SECONDARY_NAV.map(renderItem)}
      </div>
    </nav>
  );
}
