import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Phone, Mail } from "lucide-react"
import { prisma } from "@/lib/prisma"
import type { TechnicalSpecsData, MachineWithSector, Machine } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

async function getMachine(slug: string): Promise<MachineWithSector | null> {
  return prisma.machine.findUnique({
    where: { slug, isActive: true },
    include: { sector: true },
  })
}

async function getRelated(sectorId: string, currentId: string) {
  return prisma.machine.findMany({
    where: { sectorId, isActive: true, id: { not: currentId } },
    take: 3,
    orderBy: { isFeatured: "desc" },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const m = await getMachine(slug)
  if (!m) return { title: "Makina Bulunamadı" }
  return {
    title: m.metaTitle || m.name,
    description: m.metaDescription || m.shortDescription || m.name,
    openGraph: {
      title: m.metaTitle || m.name,
      description: m.metaDescription || m.shortDescription || undefined,
      images: m.mainImage ? [{ url: m.mainImage }] : undefined,
    },
  }
}

export default async function MachineDetailPage({ params }: Props) {
  const { slug } = await params
  const machine = await getMachine(slug)
  if (!machine) notFound()

  const related = await getRelated(machine.sectorId, machine.id)
  const specs = machine.technicalSpecs as unknown as TechnicalSpecsData

  return (
    <>
      {/* Breadcrumb */}
      <section className="border-b bg-muted py-16 md:py-20">
        <div className="container-page">
          <nav className="mb-6 text-[13px] text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Ana Sayfa</Link></li>
              <li className="text-border">/</li>
              <li><Link href="/sektorler" className="hover:text-primary">Sektörler</Link></li>
              <li className="text-border">/</li>
              <li>
                <Link href={`/sektorler/${machine.sector.slug}`} className="hover:text-primary">
                  {machine.sector.name}
                </Link>
              </li>
              <li className="text-border">/</li>
              <li className="text-primary">{machine.name}</li>
            </ol>
          </nav>

          <Link
            href={`/sektorler/${machine.sector.slug}`}
            className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {machine.sector.name}
          </Link>

          <h1 className="max-w-2xl text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-primary">
            {machine.name}
          </h1>
          {machine.shortDescription && (
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
              {machine.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main */}
            <div className="lg:col-span-2 space-y-12">
              {/* Main image */}
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                {machine.mainImage ? (
                  <Image src={machine.mainImage} alt={machine.name} width={900} height={506} sizes="(max-width: 1024px) 100vw, 66vw" className="aspect-video w-full object-cover" />
                ) : (
                  <div className="flex aspect-video items-center justify-center">
                    <span className="text-[48px] font-extrabold text-muted-foreground/10">
                      {machine.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Gallery */}
              {machine.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {machine.images.slice(0, 4).map((img: string, i: number) => (
                    <div key={i} className="relative overflow-hidden rounded-lg border bg-muted">
                      <Image src={img} alt={`${machine.name} ${i + 1}`} width={220} height={220} sizes="25vw" className="aspect-square w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="mb-4 text-[20px] font-bold text-primary">Açıklama</h2>
                <p className="whitespace-pre-line text-[14px] leading-[1.8] text-muted-foreground">
                  {machine.description}
                </p>
              </div>

              {/* Features */}
              {machine.features.length > 0 && (
                <div>
                  <h2 className="mb-4 text-[20px] font-bold text-primary">Öne Çıkan Özellikler</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {machine.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border bg-white p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span className="text-[14px] text-primary">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs */}
              {specs?.categories?.length > 0 && (
                <div>
                  <h2 className="mb-4 text-[20px] font-bold text-primary">Teknik Özellikler</h2>
                  <div className="space-y-4">
                    {specs.categories.map((cat, ci) => (
                      <div key={ci} className="overflow-hidden rounded-xl border">
                        <div className="bg-muted px-5 py-3">
                          <h3 className="text-[14px] font-bold text-primary">{cat.category}</h3>
                        </div>
                        <div className="divide-y">
                          {cat.specs.map((sp, si) => (
                            <div key={si} className="flex items-center justify-between px-5 py-3 text-[14px]">
                              <span className="text-muted-foreground">{sp.label}</span>
                              <span className="font-semibold text-primary">
                                {sp.value}
                                {sp.unit && <span className="ml-1 font-normal text-muted-foreground">{sp.unit}</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-5">
                {/* CTA */}
                <Card className="p-0 py-0 shadow-none">
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-[16px] font-bold text-primary">Bilgi Alın</h3>
                    <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground">
                      Fiyat teklifi ve detaylı bilgi için uzman ekibimize ulaşın.
                    </p>
                    <div className="space-y-2.5">
                      <Button asChild className="w-full">
                        <Link href="/iletisim">
                          <Mail className="h-4 w-4" />
                          Teklif İsteyin
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <a href="tel:+902121234567">
                          <Phone className="h-4 w-4" />
                          Hemen Arayın
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Info */}
                <Card className="p-0 py-0 shadow-none">
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-[14px] font-bold text-primary">Makina Bilgileri</h3>
                    <dl className="space-y-2.5 text-[13px]">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Sektör</dt>
                        <dd>
                          <Link href={`/sektorler/${machine.sector.slug}`} className="font-semibold text-accent hover:underline">
                            {machine.sector.name}
                          </Link>
                        </dd>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Özellik</dt>
                        <dd className="font-semibold text-primary">{machine.features.length} adet</dd>
                      </div>
                      {specs?.categories && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Teknik Kategori</dt>
                            <dd className="font-semibold text-primary">{specs.categories.length} adet</dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16 border-t pt-12">
              <h2 className="mb-6 text-[20px] font-bold text-primary">Benzer Makinalar</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r: Machine) => (
                  <Link
                    key={r.id}
                    href={`/makinalar/${r.slug}`}
                    className="group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-16/10 bg-muted">
                      {r.mainImage ? (
                        <Image src={r.mainImage} alt={r.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-[28px] font-extrabold text-muted-foreground/10">{r.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-[14px] font-bold text-primary group-hover:text-accent">{r.name}</h3>
                      {r.shortDescription && (
                        <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">{r.shortDescription}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: machine.name,
            description: machine.shortDescription || machine.description,
            image: machine.mainImage || undefined,
            brand: { "@type": "Organization", name: "ERKATEK Makina" },
            category: machine.sector.name,
          }),
        }}
      />
    </>
  )
}
