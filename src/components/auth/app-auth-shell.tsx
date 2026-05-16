"use client";

import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { NavigationBar } from "@/components/scrum/navigation";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

type AppAuthShellProps = {
  children: React.ReactNode;
};

/**
 * Auth gate must live in a Client Component so SignedIn/SignedOut subscribe to
 * session changes. Using them directly in the root layout uses RSC auth() and
 * does not update after client-side sign-out until a full refresh.
 */
export function AppAuthShell({ children }: AppAuthShellProps) {
  return (
    <>
      <SignedOut>
        <div className="flex justify-center items-center min-h-screen bg-background">
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        <QueryProvider>
          <LanguageProvider>
            <NavigationBar>{children}</NavigationBar>
            <Toaster />
          </LanguageProvider>
        </QueryProvider>
      </SignedIn>
    </>
  );
}
