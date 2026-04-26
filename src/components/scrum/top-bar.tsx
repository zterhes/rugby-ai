"use client";

import { UserButton } from "@clerk/nextjs";
import { MdNotifications, MdSettings } from "react-icons/md";

export function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 px-6 flex justify-between items-center border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl shadow-2xl shadow-black/50 font-sans antialiased text-sm tracking-tight">
      <div className="flex items-center gap-4">
        <span className="text-xl font-black uppercase italic tracking-tighter text-red-600">
          ScrumMaster
        </span>
      </div>

      <div className="flex items-center gap-4">
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
