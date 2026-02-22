import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAdminMachine } from "@/lib/queries/machines"
import { getFormSectors } from "@/lib/queries/sectors"
import { MachineForm } from "@/components/admin/MachineForm"

interface EditMachinePageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Makina Düzenle",
}

export default async function EditMachinePage({
  params,
}: EditMachinePageProps) {
  const { id } = await params
  const [machine, sectors] = await Promise.all([
    getAdminMachine(id),
    getFormSectors(),
  ])

  if (!machine) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Makina Düzenle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {machine.name} makinasının bilgilerini düzenleyin.
        </p>
      </div>

      <MachineForm sectors={sectors} machine={machine} />
    </div>
  )
}
