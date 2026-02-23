import type { Metadata } from "next"
import Link from "next/link"
import {
  Target,
  Eye,
  Shield,
  TrendingUp,
  Users,
  Award,
  Factory,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "ERKATEK Makina hakkında. 25 yılı aşkın tecrübemizle endüstriyel makina üretiminde Türkiye'nin öncü firmalarından biriyiz.",
}

const values = [
  { icon: Shield, title: "Kalite", desc: "Her üretim sürecinde en yüksek kalite standartları." },
  { icon: TrendingUp, title: "İnovasyon", desc: "Sürekli Ar-Ge ile sektörde öncü çözümler." },
  { icon: Users, title: "Müşteri Odaklılık", desc: "İhtiyaçlara özel çözümler üretiyoruz." },
  { icon: Award, title: "Güvenilirlik", desc: "Uzun vadeli iş birliği ilişkileri kuruyoruz." },
]

const milestones = [
  { year: "2000", title: "Kuruluş", desc: "İstanbul'da kurulduk." },
  { year: "2005", title: "İlk İhracat", desc: "Avrupa pazarına açıldık." },
  { year: "2010", title: "ISO 9001", desc: "Kalite sertifikasını aldık." },
  { year: "2015", title: "Yeni Tesis", desc: "10.000 m² tesise taşındık." },
  { year: "2020", title: "R&D Merkezi", desc: "Ar-Ge merkezini açtık." },
  { year: "2024", title: "Global Marka", desc: "30+ ülkeye ihracat." },
]

const factoryStats = [
  { icon: Factory, value: "10.000+", label: "m² Üretim Alanı" },
  { icon: Users, value: "120+", label: "Uzman Çalışan" },
  { icon: Award, value: "15+", label: "Kalite Sertifikası" },
  { icon: CheckCircle2, value: "30+", label: "İhracat Ülkesi" },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted py-16 md:py-20">
        <div className="container-page">
          <nav className="mb-6 text-[13px] text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Ana Sayfa</Link></li>
              <li className="text-border">/</li>
              <li className="text-primary">Hakkımızda</li>
            </ol>
          </nav>
          <h1 className="max-w-2xl text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-primary">
            25 yılı aşkın deneyimle endüstrinin gücü
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            ERKATEK Makina olarak, Türkiye&apos;nin öncü endüstriyel makina
            üreticilerinden biriyiz.
          </p>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-none">
              <CardContent className="p-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <CardTitle className="mb-3 text-[20px]">Misyonumuz</CardTitle>
                <CardDescription className="text-[14px] leading-relaxed">
                  Müşterilerimize en yüksek kalite standartlarında, güvenilir ve
                  verimli endüstriyel makina çözümleri sunarak üretim süreçlerini
                  optimize etmek.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="p-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Eye className="h-5 w-5" />
                </div>
                <CardTitle className="mb-3 text-[20px]">Vizyonumuz</CardTitle>
                <CardDescription className="text-[14px] leading-relaxed">
                  Endüstriyel makina üretiminde global bir marka olarak tanınmak,
                  inovatif teknolojilerle sektörün geleceğini şekillendirmek.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Değerler */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-accent">
              Değerlerimiz
            </p>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-primary">
              Bizi biz yapan temel ilkeler
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <Card key={v.title} className="shadow-none text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mb-1 text-[15px]">{v.title}</CardTitle>
                  <CardDescription className="text-[13px] leading-relaxed">{v.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tarihçe */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mb-10">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-accent">
              Tarihçe
            </p>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-primary">
              Yıllar içindeki yolculuğumuz
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map((m) => (
              <div key={m.year} className="rounded-xl border bg-white p-6">
                <span className="text-[13px] font-bold text-accent">{m.year}</span>
                <h3 className="mt-1 text-[15px] font-bold text-primary">{m.title}</h3>
                <p className="mt-1 text-[13px] text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {factoryStats.map((s) => (
              <div key={s.label}>
                <s.icon className="mx-auto mb-2 h-5 w-5 text-accent" />
                <p className="text-[28px] font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-[12px] text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container-page text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-primary">
            Birlikte çalışalım
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-muted-foreground">
            Projeniz hakkında konuşmak ister misiniz?
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/iletisim">
              İletişime Geçin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
