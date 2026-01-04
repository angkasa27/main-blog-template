import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Blog Platform",
    template: "%s | Blog Platform",
  },
  description:
    "A modern blog platform built with Next.js, featuring authentication, content management, and SEO optimization.",
  keywords: ["blog", "Next.js", "TypeScript", "web development", "technology"],
  authors: [{ name: "Blog Platform" }],
  creator: "Blog Platform",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Blog Platform",
    title: "Blog Platform",
    description:
      "A modern blog platform built with Next.js, featuring authentication, content management, and SEO optimization.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@blogplatform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
