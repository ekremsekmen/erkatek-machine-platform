import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

/**
 * Single active machine with sector for public detail page.
 */
export const getPublicMachine = unstable_cache(
  async (slug: string) => {
    return prisma.machine.findUnique({
      where: { slug, isActive: true },
      include: { sector: true },
    })
  },
  ["public-machine"],
  { tags: ["machines"], revalidate: 3600 }
)

/**
 * Related machines for detail page sidebar.
 */
export const getRelatedMachines = unstable_cache(
  async (sectorId: string, currentId: string) => {
    return prisma.machine.findMany({
      where: { sectorId, isActive: true, id: { not: currentId } },
      take: 3,
      orderBy: { isFeatured: "desc" },
    })
  },
  ["related-machines"],
  { tags: ["machines"], revalidate: 3600 }
)

/**
 * All machines with sector for admin listing page.
 */
export const getAdminMachines = unstable_cache(
  async () => {
    return prisma.machine.findMany({
      include: { sector: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })
  },
  ["admin-machines"],
  { tags: ["machines"], revalidate: 3600 }
)

/**
 * Single machine for admin edit page.
 */
export const getAdminMachine = unstable_cache(
  async (id: string) => {
    return prisma.machine.findUnique({
      where: { id },
    })
  },
  ["admin-machine"],
  { tags: ["machines"], revalidate: 3600 }
)

/**
 * Dashboard statistics.
 */
export const getDashboardStats = unstable_cache(
  async () => {
    const [sectorCount, machineCount, activeMachines, featuredMachines] =
      await Promise.all([
        prisma.sector.count(),
        prisma.machine.count(),
        prisma.machine.count({ where: { isActive: true } }),
        prisma.machine.count({ where: { isFeatured: true } }),
      ])

    return { sectorCount, machineCount, activeMachines, featuredMachines }
  },
  ["dashboard-stats"],
  { tags: ["sectors", "machines"], revalidate: 3600 }
)
