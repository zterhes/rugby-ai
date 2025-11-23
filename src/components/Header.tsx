"use client";

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import logo from "@/assets/szines_logo.png";

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="mb-4 sm:mb-6 md:mb-8 animate-fade-in">
      <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 shadow-lg flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
          <Image
            src={logo.src}
            alt="Honcharosun Gorillak Rugby Club"
            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain drop-shadow-lg flex-shrink-0"
            width={64}
            height={64}
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
              {t.header.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {t.header.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <LanguageSelector />
          <UserButton
            showName
            appearance={{
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorForeground: "hsl(var(--foreground))",
                colorBackground: "hsl(var(--background))",
                colorText: "hsl(var(--foreground))",
              },
              elements: {
                userButtonPopoverCard: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                },
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};
