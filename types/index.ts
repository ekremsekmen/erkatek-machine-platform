import type { Sector, Machine, User, Role } from "@prisma/client"

/* ------------------------------------------------------------------ */
/*  Technical Specifications (JSONB)                                   */
/* ------------------------------------------------------------------ */

export interface TechnicalSpecItem {
  label: string
  value: string
  unit?: string
}

export interface TechnicalSpec {
  category: string
  specs: TechnicalSpecItem[]
}

export interface TechnicalSpecsData {
  categories: TechnicalSpec[]
}

/* ------------------------------------------------------------------ */
/*  Extended Prisma Types                                              */
/* ------------------------------------------------------------------ */

/** Machine with its related sector */
export type MachineWithSector = Machine & {
  sector: Sector
}

/** Sector with its related machines */
export type SectorWithMachines = Sector & {
  machines: Machine[]
}

/** Sector with machine count (for listing pages) */
export type SectorWithCount = Sector & {
  _count: {
    machines: number
  }
}


/* ------------------------------------------------------------------ */
/*  Re-exports from Prisma                                             */
/* ------------------------------------------------------------------ */

export type { Sector, Machine, User, Role }
