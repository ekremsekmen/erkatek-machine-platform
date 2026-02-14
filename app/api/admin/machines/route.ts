import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createMachineSchema } from "@/lib/validations/machine"
import { z } from "zod"

/**
 * GET /api/admin/machines
 * List all machines with sector info (admin only)
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const machines = await prisma.machine.findMany({
      include: { sector: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(machines)
  } catch (error) {
    console.error("Machines GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/machines
 * Create a new machine (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validated = createMachineSchema.parse(body)

    // Check for duplicate slug
    const existing = await prisma.machine.findUnique({
      where: { slug: validated.slug },
    })
    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor." },
        { status: 409 }
      )
    }

    // Verify sector exists
    const sector = await prisma.sector.findUnique({
      where: { id: validated.sectorId },
    })
    if (!sector) {
      return NextResponse.json(
        { error: "Seçilen sektör bulunamadı." },
        { status: 400 }
      )
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

    return NextResponse.json(machine, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Machine creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
