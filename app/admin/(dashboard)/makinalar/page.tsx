import type { Metadata } from "next"
import { getAdminMachines } from "@/lib/queries/machines"
import { MachineListClient } from "@/components/admin/MachineListClient"

export const metadata: Metadata = {
  title: "Makinalar",
}

export default async function AdminMachinesPage() {
  const machines = await getAdminMachines()

  return <MachineListClient machines={machines} />
}
