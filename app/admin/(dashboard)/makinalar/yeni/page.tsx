import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { MachineForm } from "@/components/admin/MachineForm"

export const metadata: Metadata = {
  title: "Yeni Makina Ekle",
}

async function getSectors() {
  return prisma.sector.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}

export default async function NewMachinePage() {
  const sectors = await getSectors()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Yeni Makina Ekle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Yeni bir makina oluşturun ve bilgilerini girin.
        </p>
      </div>

      <MachineForm sectors={sectors} />
    </div>
  )
}
