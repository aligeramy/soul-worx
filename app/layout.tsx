import type { Metadata } from "next";
import { Geist, Geist_Mono, Crimson_Text } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/components/shop/cart-provider";
import { NavigationServerWrapper } from "@/components/navigation/navigation-server-wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const exodusRegular = localFont({
  src: "../public/font/main/ExodusDemo-Regular.woff2",
  variable: "--font-exodus-reg",
  display: "swap",
});

const exodusSharp = localFont({
  src: "../public/font/main/ExodusDemo-Sa.woff",
  variable: "--font-exodus-sharp",
  display: "swap",
});

const monteci = localFont({
  src: "../public/font/main/MONTECI-Regular.woff2",
  variable: "--font-monteci",
  display: "swap",
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${exodusRegular.variable} ${exodusSharp.variable} ${monteci.variable} ${crimson.variable} font-geist antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            <NavigationServerWrapper />
            {children}
          </CartProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
