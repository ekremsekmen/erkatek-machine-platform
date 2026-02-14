import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateSectorSchema } from "@/lib/validations/sector"
import { z } from "zod"

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/admin/sectors/[id]
 * Update a sector (admin only)
 */
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await req.json()
    const validated = updateSectorSchema.parse(body)

    // Check if sector exists
    const existing = await prisma.sector.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Sektör bulunamadı." },
        { status: 404 }
      )
    }

    // Check slug uniqueness if slug is being changed
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.sector.findUnique({
        where: { slug: validated.slug },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor." },
          { status: 409 }
        )
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

    return NextResponse.json(sector)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Sector update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/sectors/[id]
 * Delete a sector and its machines (admin only)
 */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const existing = await prisma.sector.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Sektör bulunamadı." },
        { status: 404 }
      )
    }

    // Cascade delete is handled by Prisma schema (onDelete: Cascade)
    await prisma.sector.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sector delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
