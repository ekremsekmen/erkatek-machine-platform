import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import type { SectorWithCount } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sektörler",
  description:
    "ERKATEK Makina'nın hizmet verdiği sektörler.",
}

async function getSectors(): Promise<SectorWithCount[]> {
  return prisma.sector.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { machines: { where: { isActive: true } } } },
    },
    orderBy: { order: "asc" },
  })
}

export default async function SectorsPage() {
  const sectors = await getSectors()

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted py-16 md:py-20">
        <div className="container-page">
          <nav className="mb-6 text-[13px] text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Ana Sayfa</Link></li>
              <li className="text-border">/</li>
              <li className="text-primary">Sektörler</li>
            </ol>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-primary">
            Sektörler
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            Farklı sektörlere özel, yüksek kaliteli endüstriyel makina
            çözümlerimizi keşfedin.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          {sectors.length === 0 ? (
            <div className="py-20 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-muted-foreground">Henüz sektör eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sectors.map((sector) => (
                <Link key={sector.id} href={`/sektorler/${sector.slug}`} className="group block">
                  <Card className="h-full p-0 py-0 shadow-none hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Image */}
                      {sector.image && (
                        <div className="relative mb-4 aspect-16/10 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={sector.image}
                            alt={sector.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-[16px] font-bold text-primary group-hover:text-accent">
                            {sector.name}
                          </h2>
                          {sector.description && (
                            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                              {sector.description}
                            </p>
                          )}
                          <Badge variant="secondary" className="mt-3 bg-accent/10 text-accent">
                            {sector._count.machines} Makina
                          </Badge>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
