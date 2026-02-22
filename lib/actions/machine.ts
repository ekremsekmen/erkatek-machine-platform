"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateTag } from "next/cache"
import {
  createMachineSchema,
  updateMachineSchema,
} from "@/lib/validations/machine"
import { z } from "zod"

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Create a new machine (admin only).
 */
export async function createMachine(
  data: z.input<typeof createMachineSchema>
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim." }

  try {
    const validated = createMachineSchema.parse(data)

    const existing = await prisma.machine.findUnique({
      where: { slug: validated.slug },
    })
    if (existing) {
      return { success: false, error: "Bu slug zaten kullanılıyor." }
    }

    const sector = await prisma.sector.findUnique({
      where: { id: validated.sectorId },
    })
    if (!sector) {
      return { success: false, error: "Seçilen sektör bulunamadı." }
    }

    const machine = await prisma.machine.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        shortDescription: validated.shortDescription || null,
        sectorId: validated.sectorId,
        images: validated.images,
        mainImage: validated.mainImage || null,
        technicalSpecs: validated.technicalSpecs,
        features: validated.features,
        isActive: validated.isActive,
        isFeatured: validated.isFeatured,
        order: validated.order,
        metaTitle: validated.metaTitle || null,
        metaDescription: validated.metaDescription || null,
      },
      include: { sector: true },
    })

    updateTag("machines")
    return { success: true, data: machine }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Doğrulama hatası.",
      }
    }
    console.error("Machine creation error:", error)
    return { success: false, error: "Bir hata oluştu." }
  }
}

/**
 * Update an existing machine (admin only).
 */
export async function updateMachine(
  id: string,
  data: z.input<typeof updateMachineSchema>
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim." }

  try {
    const validated = updateMachineSchema.parse(data)

    const existing = await prisma.machine.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Makina bulunamadı." }
    }

    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.machine.findUnique({
        where: { slug: validated.slug },
      })
      if (slugExists) {
        return { success: false, error: "Bu slug zaten kullanılıyor." }
      }
    }

    const machine = await prisma.machine.update({
      where: { id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.slug !== undefined && { slug: validated.slug }),
        ...(validated.description !== undefined && {
          description: validated.description,
        }),
        ...(validated.shortDescription !== undefined && {
          shortDescription: validated.shortDescription || null,
        }),
        ...(validated.sectorId !== undefined && {
          sectorId: validated.sectorId,
        }),
        ...(validated.images !== undefined && { images: validated.images }),
        ...(validated.mainImage !== undefined && {
          mainImage: validated.mainImage || null,
        }),
        ...(validated.technicalSpecs !== undefined && {
          technicalSpecs: validated.technicalSpecs,
        }),
        ...(validated.features !== undefined && {
          features: validated.features,
        }),
        ...(validated.isActive !== undefined && {
          isActive: validated.isActive,
        }),
        ...(validated.isFeatured !== undefined && {
          isFeatured: validated.isFeatured,
        }),
        ...(validated.order !== undefined && { order: validated.order }),
        ...(validated.metaTitle !== undefined && {
          metaTitle: validated.metaTitle || null,
        }),
        ...(validated.metaDescription !== undefined && {
          metaDescription: validated.metaDescription || null,
        }),
      },
      include: { sector: true },
    })

    updateTag("machines")
    return { success: true, data: machine }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Doğrulama hatası.",
      }
    }
    console.error("Machine update error:", error)
    return { success: false, error: "Bir hata oluştu." }
  }
}

/**
 * Delete a machine (admin only).
 */
export async function deleteMachine(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim." }

  try {
    const existing = await prisma.machine.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Makina bulunamadı." }
    }

    await prisma.machine.delete({ where: { id } })

    updateTag("machines")
    return { success: true, data: null }
  } catch (error) {
    console.error("Machine deletion error:", error)
    return { success: false, error: "Bir hata oluştu." }
  }
}
