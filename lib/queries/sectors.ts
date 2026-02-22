import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

/**
 * Active sectors for navbar (minimal fields).
 * Cached with "sectors" tag — invalidated when sectors change.
 */
export const getNavSectors = unstable_cache(
  async () => {
    return prisma.sector.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { order: "asc" },
    })
  },
  ["nav-sectors"],
  { tags: ["sectors"], revalidate: 3600 }
)

/**
 * Active sectors with machine count for public listing page.
 */
export const getPublicSectors = unstable_cache(
  async () => {
    return prisma.sector.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { machines: { where: { isActive: true } } } },
      },
      orderBy: { order: "asc" },
    })
  },
  ["public-sectors"],
  { tags: ["sectors", "machines"], revalidate: 3600 }
)

/**
 * Single sector with its active machines for public detail page.
 */
export const getPublicSector = unstable_cache(
  async (slug: string) => {
    return prisma.sector.findUnique({
      where: { slug, isActive: true },
      include: {
        machines: {
          where: { isActive: true },
          orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
        },
      },
    })
  },
  ["public-sector"],
  { tags: ["sectors", "machines"], revalidate: 3600 }
)

/**
 * Active sectors (id + name) for admin forms (machine create/edit).
 */
export const getFormSectors = unstable_cache(
  async () => {
    return prisma.sector.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    })
  },
  ["form-sectors"],
  { tags: ["sectors"], revalidate: 3600 }
)

/**
 * All sectors for admin listing page.
 */
export const getAdminSectors = unstable_cache(
  async () => {
    return prisma.sector.findMany({
      orderBy: { order: "asc" },
    })
  },
  ["admin-sectors"],
  { tags: ["sectors"], revalidate: 3600 }
)
