import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "All Fix - Complete Service & Repair Hub",
  description: "All Fix is a complete service and repair management platform for modern repair shops.",
  icons: {
    icon: "/all-fix-logo.png",
    shortcut: "/all-fix-logo.png",
    apple: "/all-fix-logo.png",
  },
};

import { StoreProvider } from "@/components/providers/store-provider";
import { AuthLoader } from "@/components/auth/auth-loader";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <AuthLoader>
            <I18nProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
                <Toaster richColors position="top-right" />
              </ThemeProvider>
            </I18nProvider>
          </AuthLoader>
        </StoreProvider>
      </body>
    </html>
  );
}
