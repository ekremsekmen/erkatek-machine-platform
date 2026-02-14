import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { MachineForm } from "@/components/admin/MachineForm"

interface EditMachinePageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Makina Düzenle",
}

async function getMachine(id: string) {
  return prisma.machine.findUnique({
    where: { id },
  })
}

async function getSectors() {
  return prisma.sector.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}

export default async function EditMachinePage({
  params,
}: EditMachinePageProps) {
  const { id } = await params
  const [machine, sectors] = await Promise.all([
    getMachine(id),
    getSectors(),
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
