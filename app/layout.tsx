import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { OutfitProvider } from "@/lib/context/outfitContext";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "em's closet",
  description: "Emily's RPG-inspired digital closet.",
  icons: {
    icon: [
      { url: "/favicon.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.ico", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OutfitProvider>{children}</OutfitProvider>
        <Footer />
        <Analytics />
        {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId="G-8DEJ105GX3" />}
      </body>
    </html>
  );
}
