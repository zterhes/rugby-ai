import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { AppAuthShell } from "@/components/auth/app-auth-shell";

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
          <AppAuthShell>{children}</AppAuthShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
