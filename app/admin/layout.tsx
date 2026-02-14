import type { Metadata } from "next"
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel | ERKATEK Makina",
    template: "%s | Admin - ERKATEK",
  },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
