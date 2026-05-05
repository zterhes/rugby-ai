import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import "./globals.css";
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
    <ClerkProvider>
      <html lang="en" className={`dark ${inter.variable}`}>
        <body className="bg-background text-on-background font-body antialiased min-h-screen overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
          <SignedOut>
            <div className="flex justify-center items-center min-h-screen bg-background">
              <SignIn
                appearance={{
                  variables: {
                    colorPrimary: "#dc2626",
                    colorBackground: "#14181f",
                    colorText: "#f1f2f4",
                    colorInputBackground: "#1d222a",
                    colorInputText: "#f1f2f4",
                  },
                }}
              />
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
