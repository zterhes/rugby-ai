"use client";

import { UserButton } from "@clerk/nextjs";
import { MdNotifications, MdSearch, MdSettings } from "react-icons/md";

type TopBarProps = {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
};

export function TopBar({ onSearchChange, searchValue = "" }: TopBarProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 px-6 flex justify-between items-center border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl shadow-2xl shadow-black/50 font-sans antialiased text-sm tracking-tight">
      <div className="flex items-center gap-4">
        <span className="text-xl font-black uppercase italic tracking-tighter text-red-600">
          ScrumMaster
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-surface-elevated/50 border border-white/5 rounded-full px-4 py-1.5 focus-within:border-primary-container/50 transition-colors">
          <MdSearch
            size={18}
            className="text-muted-foreground mr-2 shrink-0"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Quick find..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="bg-transparent border-none outline-none text-on-background text-sm w-48 placeholder:text-muted-foreground/70"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors duration-200 active:scale-95"
        >
          <MdNotifications size={20} aria-hidden />
        </button>

        <button
          type="button"
          aria-label="Settings"
          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors duration-200 active:scale-95"
        >
          <MdSettings size={20} aria-hidden />
        </button>

        <div className="ml-2 flex-shrink-0">
          <UserButton
            appearance={{
              variables: {
                colorPrimary: "#dc2626",
                colorBackground: "#14181f",
                colorText: "#f1f2f4",
              },
              elements: {
                userButtonAvatarBox: {
                  width: "32px",
                  height: "32px",
                },
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
