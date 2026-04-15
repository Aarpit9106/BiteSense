import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BiteSense — AI-Powered Nutrition Assistant",
  description:
    "Scan restaurant menus and get personalized food recommendations based on your health goals, diet, and body profile.",
  keywords: ["nutrition", "AI", "menu scanner", "health", "diet", "food recommendations"],
  openGraph: {
    title: "BiteSense — Scan. Choose. Eat Smart.",
    description: "AI-powered food recommendations tailored to your biology.",
    type: "website",
    siteName: "BiteSense",
  },
  twitter: {
    card: "summary_large_image",
    title: "BiteSense",
    description: "AI-powered food recommendations tailored to your biology.",
  },
};

export const viewport: Viewport = {
  themeColor: "#006c49",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "!bg-card/90 !backdrop-blur-xl !border !border-border/50 !text-foreground !shadow-lg",
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
