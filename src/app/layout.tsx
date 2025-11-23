import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import "./globals.css";
import ChatBot from "./page";
import { LanguageProvider } from "@/i18n/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rugby AI Assistant",
  description: "An AI-powered rugby team management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedOut>
            <div className="flex justify-center items-center h-screen bg-background">
              <SignIn
                appearance={{
                  variables: {
                    colorPrimary: "hsl(var(--primary))",
                    colorForeground: "hsl(var(--foreground))",
                    colorBackground: "hsl(var(--background))",
                    colorText: "hsl(var(--foreground))",
                    colorBorder: "hsl(var(--border))",
                  },
                }}
              />
            </div>
          </SignedOut>
          <SignedIn>
            <LanguageProvider>
              <ChatBot />
            </LanguageProvider>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
