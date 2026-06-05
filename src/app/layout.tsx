import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Famlyzer AI - Autonomous Decision & Planning Intelligence",
  description: "AI-powered system for managing time, money, energy, relationships, and life goals in one unified platform.",
  keywords: ["Famlyzer", "AI", "Planning", "Finance", "Family", "Autonomous", "Decision Intelligence", "SaaS", "Budget", "Task Management"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Famlyzer AI - Autonomous Decision & Planning Intelligence",
    description: "AI-powered system for managing time, money, energy, relationships, and life goals in one unified platform.",
    type: "website",
    siteName: "Famlyzer AI",
  },
  authors: [{ name: "Mulky Malikul Dhaher" }],
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          {children}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
