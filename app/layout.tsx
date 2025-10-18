import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/components/shop/cart-provider";
import { NavigationServerWrapper } from "@/components/navigation/navigation-server-wrapper";
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
  title: "Soulworx — Words That Walk Through Souls",
  description: "Unveil the Poetry of Life with Soulworx. Join our community for poetry, programs, events, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            <NavigationServerWrapper />
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
