"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    Shield,
    Zap,
    Wrench,
    Globe,
    ChevronRight,
    ArrowUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

/* ─── Types ──────────────────────────────────────────────── */
interface SectorItem {
    id: string
    name: string
    slug: string
}

interface LandingPageProps {
    sectors: SectorItem[]
}

/* ─── Data ───────────────────────────────────────────────── */
const stats = [
    { value: 25, suffix: "+", label: "Yıllık Deneyim" },
    { value: 500, suffix: "+", label: "Teslim Edilen Makina" },
    { value: 150, suffix: "+", label: "Mutlu Müşteri" },
    { value: 30, suffix: "+", label: "İhracat Ülkesi" },
]

const capabilities = [
    {
        icon: Shield,
        title: "Güvenilirlik",
        desc: "ISO 9001 kalite standartlarında üretim. Her makina titizlikle test edilir.",
        gradient: "from-blue-500/10 to-indigo-500/10",
        iconColor: "text-blue-600",
        borderHover: "group-hover:border-blue-500/30",
    },
    {
        icon: Zap,
        title: "Yüksek Performans",
        desc: "PLC kontrollü otomasyon sistemleri ile maksimum verimlilik.",
        gradient: "from-amber-500/10 to-orange-500/10",
        iconColor: "text-amber-600",
        borderHover: "group-hover:border-amber-500/30",
    },
    {
        icon: Wrench,
        title: "Teknik Destek",
        desc: "7/24 teknik destek ve periyodik bakım hizmetleri.",
        gradient: "from-emerald-500/10 to-teal-500/10",
        iconColor: "text-emerald-600",
        borderHover: "group-hover:border-emerald-500/30",
    },
    {
        icon: Globe,
        title: "Global Standartlar",
        desc: "CE sertifikalı, 30'dan fazla ülkeye ihracat deneyimi.",
        gradient: "from-violet-500/10 to-purple-500/10",
        iconColor: "text-violet-600",
        borderHover: "group-hover:border-violet-500/30",
    },
]

const steps = [
    {
        num: "01",
        title: "Keşif & Analiz",
        desc: "İhtiyaçlarınızı detaylı analiz ediyoruz.",
    },
    {
        num: "02",
        title: "Mühendislik",
        desc: "Özel çözümler tasarlıyor, 3D modelleme yapıyoruz.",
    },
    {
        num: "03",
        title: "Üretim",
        desc: "Kalite kontrol altında üretim gerçekleştiriyoruz.",
    },
    {
        num: "04",
        title: "Teslim & Destek",
        desc: "Kurulum, eğitim ve teknik destek sunuyoruz.",
    },
]

/* ─── Hook: Intersection Observer ──────────────────────── */
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                    obs.unobserve(el)
                }
            },
            { threshold }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])

    return { ref, inView }
}

/* ─── Hook: Animated Counter ───────────────────────────── */
function useCounter(target: number, inView: boolean, duration = 2000) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!inView) return
        let start = 0
        const startTime = performance.now()

        const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const current = Math.round(eased * target)
            setCount(current)
            if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
    }, [inView, target, duration])

    return count
}

/* ─── Component: AnimatedStat ──────────────────────────── */
function AnimatedStat({
    value,
    suffix,
    label,
    inView,
    delay,
}: {
    value: number
    suffix: string
    label: string
    inView: boolean
    delay: number
}) {
    const count = useCounter(value, inView)

    return (
        <div
            className={cn(
                "relative text-center transition-[opacity,transform] duration-700",
                inView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <p className="text-[clamp(2.5rem,5vw,3.75rem)] font-black leading-none tracking-tight text-white">
                {count}
                <span className="text-accent">{suffix}</span>
            </p>
            <p className="mt-2 text-[13px] font-medium tracking-wide text-white/50 uppercase">
                {label}
            </p>
        </div>
    )
}

/* ─── Main Component ───────────────────────────────────── */
export function LandingPage({ sectors }: LandingPageProps) {
    const [heroLoaded, setHeroLoaded] = useState(false)
    const statsView = useInView(0.2)
    const capsView = useInView(0.1)
    const sectorsView = useInView(0.1)
    const processView = useInView(0.1)
    const ctaView = useInView(0.2)

    // Trigger hero animation after mount
    useEffect(() => {
        const t = setTimeout(() => setHeroLoaded(true), 100)
        return () => clearTimeout(t)
    }, [])

    return (
        <>
            {/* ══════════════════════════════════════════════════════
          HERO — Cinematic Full-Screen
      ══════════════════════════════════════════════════════ */}
            <section className="relative h-[100svh] min-h-[640px] overflow-hidden" id="hero">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero.jpg"
                        alt="ERKATEK Makina - Endüstriyel Makina Üretimi"
                        fill
                        className={cn(
                            "object-cover object-center transition-transform duration-[1.5s] ease-out",
                            heroLoaded ? "scale-100" : "scale-110"
                        )}
                        priority
                        quality={90}
                    />
                </div>

                {/* Cinematic overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                {/* Static grid lines (no animation — better perf) */}
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute left-[20%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                    <div className="absolute left-[40%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                    <div className="absolute left-[60%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                    <div className="absolute left-[80%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="container-page relative z-10 flex h-full flex-col justify-center">
                    <div className="max-w-3xl">
                        {/* Tag line with reveal */}
                        <div
                            className={cn(
                                "mb-6 flex items-center gap-3 transition-[opacity,transform] duration-700 ease-out",
                                heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{ transitionDelay: "300ms" }}
                        >
                            <div className="h-px w-12 bg-accent" />
                            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-accent">
                                Endüstriyel Makina Çözümleri
                            </p>
                        </div>

                        {/* Main heading with character split animation */}
                        <h1
                            className={cn(
                                "text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[1.05] tracking-tight text-white",
                                "transition-[opacity,transform] duration-1000 ease-out",
                                heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                            )}
                            style={{ transitionDelay: "500ms" }}
                        >
                            <span className="block">Geleceğin</span>
                            <span className="block">
                                makinalarını{" "}
                                <span className="relative inline-block">
                                    <span className="relative z-10 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent bg-[length:200%_100%] hero-text-shimmer">
                                        bugünden
                                    </span>
                                </span>
                            </span>
                            <span className="block">üretiyoruz.</span>
                        </h1>

                        {/* Subheading */}
                        <p
                            className={cn(
                                "mt-6 max-w-xl text-[clamp(1rem,1.8vw,1.25rem)] leading-relaxed text-white/60 font-light",
                                "transition-[opacity,transform] duration-700 ease-out",
                                heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{ transitionDelay: "700ms" }}
                        >
                            25 yılı aşkın tecrübemizle sektörünüze özel, uluslararası
                            standartlarda endüstriyel makina sistemleri tasarlıyor ve üretiyoruz.
                        </p>

                        {/* CTA buttons */}
                        <div
                            className={cn(
                                "mt-10 flex flex-wrap items-center gap-4",
                                "transition-[opacity,transform] duration-700 ease-out",
                                heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{ transitionDelay: "900ms" }}
                        >
                            <Button
                                asChild
                                size="lg"
                                className={cn(
                                    "h-14 px-8 text-[15px] font-semibold rounded-2xl",
                                    "bg-accent hover:bg-accent/90",
                                    "text-white shadow-2xl shadow-accent/30",
                                    "transition-[opacity,transform] duration-300 hover:shadow-accent/50 hover:-translate-y-0.5",
                                    "border-0"
                                )}
                            >
                                <Link href="/sektorler" className="flex items-center gap-3">
                                    Ürünleri Keşfet
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className={cn(
                                    "h-14 px-8 text-[15px] font-semibold rounded-2xl",
                                    "border-white/20 bg-white/5 backdrop-blur-sm",
                                    "text-white hover:bg-white/10 hover:border-white/30 hover:text-white",
                                    "transition-[opacity,transform] duration-300"
                                )}
                            >
                                <Link href="/iletisim">
                                    İletişime Geçin
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.12_0.02_248)] to-transparent" />

                {/* Scroll indicator */}
                <div
                    className={cn(
                        "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3",
                        "transition-[opacity,transform] duration-700",
                        heroLoaded ? "opacity-100" : "opacity-0"
                    )}
                    style={{ transitionDelay: "1200ms" }}
                >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
                        Scroll
                    </span>
                    <div className="relative h-10 w-[1.5px] overflow-hidden bg-white/10">
                        <div className="absolute top-0 h-4 w-full bg-white/60 scroll-indicator" />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          STATS — Glassmorphism Bar
      ══════════════════════════════════════════════════════ */}
            <section
                ref={statsView.ref}
                className="relative bg-[oklch(0.12_0.02_248)] py-20 overflow-hidden"
                id="stats"
            >
                {/* Ambient glow */}
                <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[60px]" />
                <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent/5 blur-[60px]" />

                <div className="container-page relative z-10">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
                        {stats.map((s, i) => (
                            <AnimatedStat
                                key={s.label}
                                value={s.value}
                                suffix={s.suffix}
                                label={s.label}
                                inView={statsView.inView}
                                delay={i * 150}
                            />
                        ))}
                    </div>
                </div>

                {/* Separator line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </section>

            {/* ══════════════════════════════════════════════════════
          CAPABILITIES — Interactive Cards
      ══════════════════════════════════════════════════════ */}
            <section ref={capsView.ref} className="relative py-28 md:py-36 overflow-hidden" id="capabilities">
                {/* Subtle bg pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                }} />

                <div className="container-page relative z-10">
                    {/* Section header */}
                    <div className="mb-16 max-w-xl">
                        <div
                            className={cn(
                                "mb-4 flex items-center gap-3 transition-[opacity,transform] duration-700",
                                capsView.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                            )}
                        >
                            <div className="h-px w-8 bg-accent" />
                            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-accent">
                                Neden Biz
                            </p>
                        </div>
                        <h2
                            className={cn(
                                "text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] text-primary",
                                "transition-[opacity,transform] duration-700 delay-100",
                                capsView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                        >
                            Endüstriyel üretimde{" "}
                            <span className="relative">
                                fark yaratan
                                <svg className="absolute -bottom-1 left-0 w-full h-2 text-accent/20" viewBox="0 0 200 8" preserveAspectRatio="none">
                                    <path d="M0 7 Q50 0 100 5 Q150 10 200 3" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>{" "}
                            çözümler
                        </h2>
                    </div>

                    {/* Cards grid */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {capabilities.map((c, i) => (
                            <Card
                                key={c.title}
                                className={cn(
                                    "group relative rounded-2xl border-border/60 shadow-none py-0 gap-0",
                                    "transition-[opacity,transform] duration-500 hover:shadow-xl hover:-translate-y-1",
                                    c.borderHover,
                                    capsView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                )}
                                style={{ transitionDelay: `${200 + i * 100}ms` }}
                            >
                                {/* Gradient bg on hover */}
                                <div className={cn(
                                    "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                                    c.gradient
                                )} />

                                <CardContent className="relative z-10 p-7">
                                    <div className={cn(
                                        "mb-5 flex h-12 w-12 items-center justify-center rounded-xl",
                                        "bg-gradient-to-br",
                                        c.gradient,
                                        "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                    )}>
                                        <c.icon className={cn("h-5 w-5", c.iconColor)} />
                                    </div>
                                    <CardTitle className="mb-2 text-[17px]">
                                        {c.title}
                                    </CardTitle>
                                    <CardDescription className="text-[14px] leading-relaxed">
                                        {c.desc}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          SECTORS — Bento-style Cards
      ══════════════════════════════════════════════════════ */}
            <section ref={sectorsView.ref} className="relative bg-[oklch(0.975_0.002_248)] py-28 md:py-36" id="sectors">
                <div className="container-page">
                    {/* Section header */}
                    <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                        <div className="max-w-lg">
                            <div
                                className={cn(
                                    "mb-4 flex items-center gap-3 transition-[opacity,transform] duration-700",
                                    sectorsView.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                                )}
                            >
                                <div className="h-px w-8 bg-accent" />
                                <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-accent">
                                    Ürünler
                                </p>
                            </div>
                            <h2
                                className={cn(
                                    "text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] text-primary",
                                    "transition-[opacity,transform] duration-700 delay-100",
                                    sectorsView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                )}
                            >
                                Sektöre göre ürünlerimiz
                            </h2>
                        </div>
                        <Link
                            href="/sektorler"
                            className={cn(
                                "group flex items-center gap-2 text-[14px] font-semibold text-accent",
                                "transition-[opacity,transform] duration-700 delay-200",
                                sectorsView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            )}
                        >
                            Tümünü Gör
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Sectors grid — bento style */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sectors.map((s, i) => (
                            <Link
                                key={s.slug}
                                href={`/sektorler/${s.slug}`}
                                className={cn(
                                    "group relative flex items-center justify-between overflow-hidden rounded-2xl",
                                    "border border-border/60 bg-white px-7 py-6",
                                    "transition-[opacity,transform] duration-500 hover:shadow-lg hover:-translate-y-0.5",
                                    "hover:border-accent/20",
                                    sectorsView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                )}
                                style={{ transitionDelay: `${200 + i * 80}ms` }}
                            >
                                {/* Hover gradient line */}
                                <div className="absolute left-0 top-0 h-full w-1 bg-accent scale-y-0 transition-transform duration-300 origin-top group-hover:scale-y-100" />

                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/5 text-accent transition-colors duration-300 group-hover:bg-accent/10">
                                        <span className="text-[12px] font-black">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <span className="text-[15px] font-semibold text-primary transition-colors duration-200 group-hover:text-accent">
                                        {s.name}
                                    </span>
                                </div>

                                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-[opacity,transform] duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          PROCESS — Connected Timeline
      ══════════════════════════════════════════════════════ */}
            <section ref={processView.ref} className="relative py-28 md:py-36 overflow-hidden" id="process">
                <div className="container-page">
                    {/* Section header */}
                    <div className="mb-20 max-w-xl">
                        <div
                            className={cn(
                                "mb-4 flex items-center gap-3 transition-[opacity,transform] duration-700",
                                processView.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                            )}
                        >
                            <div className="h-px w-8 bg-accent" />
                            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-accent">
                                Süreç
                            </p>
                        </div>
                        <h2
                            className={cn(
                                "text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] text-primary",
                                "transition-[opacity,transform] duration-700 delay-100",
                                processView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                        >
                            Projeden üretime,{" "}
                            <span className="text-accent">dört adım</span>
                        </h2>
                    </div>

                    {/* Timeline cards */}
                    <div className="relative grid gap-0 md:grid-cols-4">
                        {/* Connecting line (desktop) */}
                        <div className="absolute top-12 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-border/60 hidden md:block">
                            <div
                                className={cn(
                                    "h-full bg-accent/40 transition-[opacity,transform] duration-[1.5s] ease-out origin-left",
                                    processView.inView ? "scale-x-100" : "scale-x-0"
                                )}
                                style={{ transitionDelay: "600ms" }}
                            />
                        </div>

                        {steps.map((st, i) => (
                            <div
                                key={st.num}
                                className={cn(
                                    "group relative flex flex-col items-center text-center px-6 md:px-4 py-8 md:py-0",
                                    "transition-[opacity,transform] duration-700",
                                    processView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                )}
                                style={{ transitionDelay: `${300 + i * 200}ms` }}
                            >
                                {/* Step circle */}
                                <div className={cn(
                                    "relative z-10 mb-8 flex h-12 w-12 items-center justify-center rounded-full",
                                    "border-2 border-border bg-white",
                                    "transition-[opacity,transform] duration-500",
                                    "group-hover:border-accent group-hover:shadow-lg group-hover:shadow-accent/20"
                                )}>
                                    <span className="text-[14px] font-black text-primary group-hover:text-accent transition-colors duration-300">
                                        {st.num}
                                    </span>
                                    {/* Pulse ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-accent/0 group-hover:border-accent/20 transition-[opacity,transform] duration-500 group-hover:scale-[1.4] group-hover:opacity-0" />
                                </div>

                                <h3 className="mb-3 text-[17px] font-bold text-primary">
                                    {st.title}
                                </h3>
                                <p className="max-w-[220px] text-[14px] leading-relaxed text-muted-foreground">
                                    {st.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          CTA — Gradient Mesh Background
      ══════════════════════════════════════════════════════ */}
            <section
                ref={ctaView.ref}
                className="relative overflow-hidden py-28 md:py-36"
                id="cta"
            >
                {/* Deep dark background */}
                <div className="absolute inset-0 bg-[oklch(0.14_0.025_248)]" />

                {/* Static gradient orbs (no animation — better perf) */}
                <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-accent/15 blur-[80px]" />
                <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[oklch(0.5_0.2_280)]/10 blur-[80px]" />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />

                <div className="container-page relative z-10 text-center">
                    <div
                        className={cn(
                            "mx-auto max-w-2xl transition-[opacity,transform] duration-700",
                            ctaView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        )}
                    >
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <div className="h-px w-8 bg-accent/40" />
                            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-accent/70">
                                Birlikte Çalışalım
                            </p>
                            <div className="h-px w-8 bg-accent/40" />
                        </div>

                        <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.1] text-white">
                            Projeniz için ücretsiz{" "}
                            <span className="bg-gradient-to-r from-accent to-[oklch(0.6_0.2_280)] bg-clip-text text-transparent">
                                keşif ve teklif
                            </span>{" "}
                            alın
                        </h2>

                        <p
                            className={cn(
                                "mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-white/50 font-light",
                                "transition-[opacity,transform] duration-700 delay-200",
                                ctaView.inView ? "opacity-100" : "opacity-0"
                            )}
                        >
                            Uzman mühendislerimiz projenizi değerlendirsin. Size en uygun
                            makina çözümünü birlikte belirleyelim.
                        </p>

                        <div
                            className={cn(
                                "mt-10 flex flex-wrap justify-center gap-4",
                                "transition-[opacity,transform] duration-700 delay-300",
                                ctaView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                            )}
                        >
                            <Button
                                asChild
                                size="lg"
                                className={cn(
                                    "h-14 px-10 text-[15px] font-semibold rounded-2xl",
                                    "bg-accent hover:bg-accent/90",
                                    "text-white shadow-2xl shadow-accent/30",
                                    "transition-[opacity,transform] duration-300 hover:shadow-accent/50 hover:-translate-y-0.5"
                                )}
                            >
                                <Link href="/iletisim" className="flex items-center gap-3">
                                    Hemen İletişime Geçin
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className={cn(
                                    "h-14 px-10 text-[15px] font-semibold rounded-2xl",
                                    "border-white/15 bg-white/5 backdrop-blur-sm",
                                    "text-white hover:bg-white/10 hover:border-white/25 hover:text-white",
                                    "transition-[opacity,transform] duration-300"
                                )}
                            >
                                <Link href="/sektorler">
                                    Sektörleri İncele
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
