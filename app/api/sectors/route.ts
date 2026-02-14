import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/sectors
 * Public endpoint — returns active sectors for navbar dropdown.
 */
export async function GET() {
  try {
    const sectors = await prisma.sector.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(sectors)
  } catch (error) {
    console.error("Public sectors GET error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
