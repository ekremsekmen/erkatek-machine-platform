import type { Metadata } from "next"
import { getFormSectors } from "@/lib/queries/sectors"
import { MachineForm } from "@/components/admin/MachineForm"

export const metadata: Metadata = {
  title: "Yeni Makina Ekle",
}

export default async function NewMachinePage() {
  const sectors = await getFormSectors()

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
