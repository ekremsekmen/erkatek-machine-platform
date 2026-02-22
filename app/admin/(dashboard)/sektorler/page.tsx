import type { Metadata } from "next"
import { getAdminSectors } from "@/lib/queries/sectors"
import { SectorListClient } from "@/components/admin/SectorListClient"

export const metadata: Metadata = {
  title: "Sektörler",
}

export default async function AdminSectorsPage() {
  const sectors = await getAdminSectors()

  return <SectorListClient sectors={sectors} />
}
