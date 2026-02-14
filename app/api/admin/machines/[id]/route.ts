import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateMachineSchema } from "@/lib/validations/machine"
import { z } from "zod"

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/admin/machines/[id]
 * Update a machine (admin only)
 */
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await req.json()
    const validated = updateMachineSchema.parse(body)

    // Check if machine exists
    const existing = await prisma.machine.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Makina bulunamadı." },
        { status: 404 }
      )
    }

    // Check slug uniqueness if slug is being changed
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.machine.findUnique({
        where: { slug: validated.slug },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor." },
          { status: 409 }
        )
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

    return NextResponse.json(machine)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Machine update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/machines/[id]
 * Delete a machine (admin only)
 */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const existing = await prisma.machine.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Makina bulunamadı." },
        { status: 404 }
      )
    }

    await prisma.machine.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Machine delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
