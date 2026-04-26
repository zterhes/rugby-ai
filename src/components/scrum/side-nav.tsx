"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  MdDashboard,
  MdEventNote,
  MdGroup,
  MdShare,
  MdSportsRugby,
} from "react-icons/md";

type NavItem = {
  href: string;
  icon: IconType;
  label: string;
};

const NAV_PAGES: NavItem[] = [
  { href: "/dashboard", icon: MdDashboard, label: "Dashboard" },
  { href: "/roster", icon: MdGroup, label: "Roster" },
  { href: "/schedule", icon: MdEventNote, label: "Schedule" },
  { href: "/assetLibrary", icon: MdShare, label: "Asset Library" },
];

const TEAM_NAME = process.env.NEXT_PUBLIC_TEAM_NAME;

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

    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`${baseClasses} ${stateClasses}`}
      >
        <Icon className="shrink-0 text-xl" aria-hidden />
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-40 border-r border-white/5 bg-zinc-950/80 backdrop-blur-2xl shadow-[20px_0_50px_rgba(0,0,0,0.5)] pt-20 pb-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center overflow-hidden">
          <MdSportsRugby
            className="text-2xl text-red-600 shrink-0"
            aria-hidden
          />
        </div>
        <div>
          <h2 className="text-on-background font-display-title-xs text-display-title-xs leading-tight">
            {TEAM_NAME}
          </h2>
          <p className="text-muted-foreground font-subtitle-xs text-[11px]">
            Elite Division
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1 px-2 font-sans font-medium text-sm">
        {NAV_PAGES.map(renderItem)}
      </div>
    </nav>
  );
}
