import type { ReactNode } from "react"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { getNavSectors } from "@/lib/queries/sectors"

export default async function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const sectors = await getNavSectors()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar sectors={sectors} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
