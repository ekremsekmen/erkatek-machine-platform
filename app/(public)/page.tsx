import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Shield,
  Zap,
  Wrench,
  Globe,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { getNavSectors } from "@/lib/queries/sectors"

export const metadata: Metadata = {
  title: "ERKATEK Makina | Endüstriyel Makina Çözümleri",
  description:
    "ERKATEK Makina - Endüstriyel makina üretiminde güvenilir çözüm ortağınız.",
}

const stats = [
  { value: "25+", label: "Yıllık Deneyim" },
  { value: "500+", label: "Teslim Edilen Makina" },
  { value: "150+", label: "Mutlu Müşteri" },
  { value: "30+", label: "İhracat Ülkesi" },
]

const capabilities = [
  {
    icon: Shield,
    title: "Güvenilirlik",
    desc: "ISO 9001 kalite standartlarında üretim. Her makina titizlikle test edilir.",
  },
  {
    icon: Zap,
    title: "Yüksek Performans",
    desc: "PLC kontrollü otomasyon sistemleri ile maksimum verimlilik.",
  },
  {
    icon: Wrench,
    title: "Teknik Destek",
    desc: "7/24 teknik destek ve periyodik bakım hizmetleri.",
  },
  {
    icon: Globe,
    title: "Global Standartlar",
    desc: "CE sertifikalı, 30'dan fazla ülkeye ihracat deneyimi.",
  },
]



const steps = [
  { num: "01", title: "Keşif & Analiz", desc: "İhtiyaçlarınızı detaylı analiz ediyoruz." },
  { num: "02", title: "Mühendislik", desc: "Özel çözümler tasarlıyor, 3D modelleme yapıyoruz." },
  { num: "03", title: "Üretim", desc: "Kalite kontrol altında üretim gerçekleştiriyoruz." },
  { num: "04", title: "Teslim & Destek", desc: "Kurulum, eğitim ve teknik destek sunuyoruz." },
]

export default async function HomePage() {
  const sectors = await getNavSectors()
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
        {/* Background image */}
        <Image
          src="/images/hero.jpg"
          alt="ERKATEK Makina - Endüstriyel Makina Üretimi"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="container-page relative z-10">
          <div className="max-w-2xl">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-accent">
              Endüstriyel Makina Çözümleri
            </p>
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-white">
              Geleceğin makinalarını bugünden üretiyoruz.
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-white/80">
              25 yılı aşkın tecrübemizle sektörünüze özel, uluslararası
              standartlarda endüstriyel makina sistemleri tasarlıyor ve üretiyoruz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/sektorler">
                  Ürünleri Keşfet
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                <Link href="/iletisim">
                  İletişime Geçin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y bg-muted py-14">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[36px] font-extrabold leading-none text-primary">
                  {s.value}
                </p>
                <p className="mt-2 text-[13px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mb-12 max-w-lg">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-accent">
              Neden Biz
            </p>
            <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-tight text-primary">
              Endüstriyel üretimde fark yaratan çözümler
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <Card key={c.title} className="p-0 py-0 shadow-none hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mb-2 text-[16px]">{c.title}</CardTitle>
                  <CardDescription className="text-[14px] leading-relaxed">
                    {c.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS BY SECTOR ── */}
      <section className="bg-muted py-20 md:py-28">
        <div className="container-page">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-lg">
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-accent">
                Ürünler
              </p>
              <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-tight text-primary">
                Sektöre göre ürünlerimiz
              </h2>
            </div>
            <Link
              href="/sektorler"
              className="text-[14px] font-semibold text-accent hover:underline"
            >
              Tümünü Gör &rarr;
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((s) => (
              <Link
                key={s.slug}
                href={`/sektorler/${s.slug}`}
                className="group flex items-center justify-between rounded-xl border bg-white px-6 py-5 transition-shadow hover:shadow-md"
              >
                <span className="text-[15px] font-semibold text-primary group-hover:text-accent">
                  {s.name}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mb-12 max-w-lg">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-accent">
              Süreç
            </p>
            <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-tight text-primary">
              Projeden üretime, dört adım
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st) => (
              <div key={st.num} className="rounded-xl border bg-white p-6">
                <span className="mb-4 block text-[32px] font-extrabold leading-none text-accent/15">
                  {st.num}
                </span>
                <h3 className="mb-2 text-[16px] font-bold text-primary">{st.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-20 md:py-24">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-xl text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-tight text-white">
            Projeniz için ücretsiz keşif ve teklif alın
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            Uzman mühendislerimiz projenizi değerlendirsin. Size en uygun
            makina çözümünü birlikte belirleyelim.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/iletisim">
                Hemen İletişime Geçin
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              <Link href="/sektorler">
                Sektörleri İncele
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
