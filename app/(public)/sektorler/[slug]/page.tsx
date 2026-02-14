import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import type { SectorWithMachines, Machine } from "@/types"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

async function getSector(slug: string): Promise<SectorWithMachines | null> {
  return prisma.sector.findUnique({
    where: { slug, isActive: true },
    include: {
      machines: {
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sector = await getSector(slug)
  if (!sector) return { title: "Sektör Bulunamadı" }
  return {
    title: sector.name,
    description: sector.description || `${sector.name} sektörüne özel makina çözümleri.`,
  }
}

export default async function SectorDetailPage({ params }: Props) {
  const { slug } = await params
  const sector = await getSector(slug)
  if (!sector) notFound()

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted py-16 md:py-20">
        <div className="container-page">
          <nav className="mb-6 text-[13px] text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Ana Sayfa</Link></li>
              <li className="text-border">/</li>
              <li><Link href="/sektorler" className="hover:text-primary">Sektörler</Link></li>
              <li className="text-border">/</li>
              <li className="text-primary">{sector.name}</li>
            </ol>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-primary">
            {sector.name}
          </h1>
          {sector.description && (
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
              {sector.description}
            </p>
          )}
        </div>
      </section>

      {/* Machines */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-primary">
              Makinalar <span className="text-muted-foreground">({sector.machines.length})</span>
            </h2>
            <Link
              href="/sektorler"
              className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Tüm Sektörler
            </Link>
          </div>

          {sector.machines.length === 0 ? (
            <div className="py-20 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-muted-foreground">Bu sektörde henüz makina yok.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sector.machines.map((machine: Machine) => (
                <Link
                  key={machine.id}
                  href={`/makinalar/${machine.slug}`}
                  className="group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-16/10 bg-muted">
                    {machine.mainImage ? (
                      <Image
                        src={machine.mainImage}
                        alt={machine.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[36px] font-extrabold text-muted-foreground/10">
                          {machine.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {machine.isFeatured && (
                      <Badge variant="secondary" className="mb-2 bg-accent/10 text-accent">
                        Öne Çıkan
                      </Badge>
                    )}
                    <h3 className="text-[15px] font-bold text-primary group-hover:text-accent">
                      {machine.name}
                    </h3>
                    {machine.shortDescription && (
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                        {machine.shortDescription}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
