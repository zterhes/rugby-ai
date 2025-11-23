"use client";

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import logo from "@/assets/szines_logo.png";

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="mb-8 animate-fade-in">
      <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-6 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={logo.src}
            alt="Honcharosun Gorillak Rugby Club"
            className="h-16 w-16 object-contain drop-shadow-lg"
            width={64}
            height={64}
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t.header.title}
            </h1>
            <p className="text-sm text-muted-foreground">{t.header.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
