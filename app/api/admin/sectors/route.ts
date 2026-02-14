import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSectorSchema } from "@/lib/validations/sector"
import { z } from "zod"

/**
 * GET /api/admin/sectors
 * List all sectors (admin only)
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sectors = await prisma.sector.findMany({
      orderBy: { order: "asc" },
    })

    return NextResponse.json(sectors)
  } catch (error) {
    console.error("Sectors GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/sectors
 * Create a new sector (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validated = createSectorSchema.parse(body)

    // Check for duplicate slug
    const existing = await prisma.sector.findUnique({
      where: { slug: validated.slug },
    })
    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor." },
        { status: 409 }
      )
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

    return NextResponse.json(sector, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Sector creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
