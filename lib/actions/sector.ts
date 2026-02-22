"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateTag } from "next/cache"
import {
  createSectorSchema,
  updateSectorSchema,
} from "@/lib/validations/sector"
import { z } from "zod"

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Create a new sector (admin only).
 */
export async function createSector(
  data: z.input<typeof createSectorSchema>
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim." }

  try {
    const validated = createSectorSchema.parse(data)

    const existing = await prisma.sector.findUnique({
      where: { slug: validated.slug },
    })
    if (existing) {
      return { success: false, error: "Bu slug zaten kullanılıyor." }
    }

    const sector = await prisma.sector.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description || null,
        image: validated.image || null,
        order: validated.order,
        isActive: validated.isActive,
      },
    })

    updateTag("sectors")
    return { success: true, data: sector }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Doğrulama hatası.",
      }
    }
    console.error("Sector creation error:", error)
    return { success: false, error: "Bir hata oluştu." }
  }
}

/**
 * Update an existing sector (admin only).
 */
export async function updateSector(
  id: string,
  data: z.input<typeof updateSectorSchema>
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim." }

  try {
    const validated = updateSectorSchema.parse(data)

    const existing = await prisma.sector.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Sektör bulunamadı." }
    }

    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.sector.findUnique({
        where: { slug: validated.slug },
      })
      if (slugExists) {
        return { success: false, error: "Bu slug zaten kullanılıyor." }
      }
    }

    const sector = await prisma.sector.update({
      where: { id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.slug !== undefined && { slug: validated.slug }),
        ...(validated.description !== undefined && {
          description: validated.description || null,
        }),
        ...(validated.image !== undefined && {
          image: validated.image || null,
        }),
        ...(validated.order !== undefined && { order: validated.order }),
        ...(validated.isActive !== undefined && {
          isActive: validated.isActive,
        }),
      },
    })

    updateTag("sectors")
    return { success: true, data: sector }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Doğrulama hatası.",
      }
    }
    console.error("Sector update error:", error)
    return { success: false, error: "Bir hata oluştu." }
  }
}

/**
 * Delete a sector and its cascaded machines (admin only).
 */
export async function deleteSector(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim." }

  try {
    const existing = await prisma.sector.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Sektör bulunamadı." }
    }

    await prisma.sector.delete({ where: { id } })

    updateTag("sectors")
    updateTag("machines")
    return { success: true, data: null }
  } catch (error) {
    console.error("Sector deletion error:", error)
    return { success: false, error: "Bir hata oluştu." }
  }
}
