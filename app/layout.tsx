import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "DSR — Independent Quality, Engineering & Advisory for Solar and Storage",
  description:
    "DSR (Driving Sustainable Renewables) provides independent quality assurance, engineering, advisory and digital intelligence for solar and battery energy storage projects.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#030508" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint to avoid a flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
