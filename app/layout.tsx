import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "@/app/globals.css"
import React from "react";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "ERKATEK Makina | Endüstriyel Makina Çözümleri",
    template: "%s | ERKATEK Makina",
  },
  description:
    "ERKATEK Makina - Endüstriyel makina üretimi ve çözümleri. Sektöre özel, yüksek kaliteli ve güvenilir makina sistemleri.",
  keywords: [
    "makina üretimi",
    "endüstriyel makina",
    "erkatek",
    "makina çözümleri",
    "türkiye makina",
  ],
  authors: [{ name: "ERKATEK Makina" }],
  creator: "ERKATEK Makina",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "ERKATEK Makina",
    title: "ERKATEK Makina | Endüstriyel Makina Çözümleri",
    description:
      "ERKATEK Makina - Endüstriyel makina üretimi ve çözümleri. Sektöre özel, yüksek kaliteli ve güvenilir makina sistemleri.",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
