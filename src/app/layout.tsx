import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import "./globals.css";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { NavigationBar } from "@/components/scrum/navigation";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScrumMaster",
  description: "An AI-powered rugby team management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={`dark ${inter.variable}`}>
        <body className="bg-background text-on-background font-body antialiased min-h-screen overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
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
        </body>
      </html>
    </ClerkProvider>
  );
}
