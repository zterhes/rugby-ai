"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations, Language } from "@/i18n/translations";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value as Language)}
    >
      <SelectTrigger className="w-[120px] bg-transparent border-border/50 hover:bg-accent/10">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-xl">{translations[language].flag}</span>
            <span className="uppercase text-sm font-medium">
              {translations[language].code}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(translations) as Language[]).map((lang) => (
          <SelectItem key={lang} value={lang}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{translations[lang].flag}</span>
              <span className="uppercase text-sm font-medium">
                {translations[lang].code}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
