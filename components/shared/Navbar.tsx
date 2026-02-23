"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Phone,
  Mail,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Layers,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SectorItem {
  id: string
  name: string
  slug: string
}

interface NavbarProps {
  sectors?: SectorItem[]
}

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
]

export function Navbar({ sectors: initialSectors = [] }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const sectors = initialSectors
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // ── Scroll detection ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)
      // subtle progress bar driven by first 600px of scroll
      setScrollProgress(Math.min(y / 600, 1))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── Close mobile on route change ──────────────────────────
  useEffect(() => {
    setMobileOpen(false)
    setProductsOpen(false)
  }, [pathname])

  // ── Close dropdown on outside click ──────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setProductsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ── Lock body scroll when mobile open ─────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const isProductsActive =
    pathname.startsWith("/sektorler") || pathname.startsWith("/makinalar")

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <>
      {/* ══════════════════════════════════════════════════
          MAIN HEADER
      ══════════════════════════════════════════════════ */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full will-change-transform",
          "transition-all duration-300 ease-out",
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_32px_rgba(44,62,80,0.10)]"
            : "bg-white border-b border-[oklch(0.94_0.003_248)]"
        )}
      >
        {/* Scroll-progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent via-[oklch(0.5_0.2_280)] to-accent/40 transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%`, opacity: scrolled ? 1 : 0 }}
        />

        <nav className="container-page flex h-16 items-center justify-between lg:h-[68px]">

          {/* ── Logo ───────────────────────────────────── */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-lg"
            aria-label="ERKATEK Makina – Ana Sayfa"
          >
            {/* Icon mark */}
            <div
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden",
                "bg-gradient-to-br from-primary to-[oklch(0.22_0.03_248)]",
                "shadow-lg shadow-primary/20",
                "transition-transform duration-300 group-hover:scale-105"
              )}
            >
              {/* Gloss overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
              {/* Inner "E" geometric mark */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="relative h-5 w-5 text-white"
                aria-hidden="true"
              >
                <rect x="4" y="4" width="3" height="16" rx="1" fill="currentColor" />
                <rect x="7" y="4" width="9" height="2.5" rx="1" fill="currentColor" />
                <rect x="7" y="10.75" width="7" height="2.5" rx="1" fill="currentColor" />
                <rect x="7" y="17.5" width="9" height="2.5" rx="1" fill="currentColor" />
              </svg>
            </div>

            {/* Wordmark */}
            <div className="leading-[1]">
              <span
                className={cn(
                  "block text-[15px] font-black tracking-[0.06em] text-primary",
                  "transition-colors duration-200 group-hover:text-accent"
                )}
              >
                ERKATEK
              </span>
              <span className="block text-[8.5px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Makina
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ─────────────────────────────── */}
          <nav className="hidden items-center lg:flex" aria-label="Ana menü">
            <ul className="flex items-center gap-1" role="list">

              {/* Regular links */}
              {[
                { label: "Ana Sayfa", href: "/" },
                { label: "Hakkımızda", href: "/hakkimizda" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "relative flex h-10 items-center px-4 text-[13.5px] font-semibold",
                      "rounded-lg transition-colors duration-200",
                      "hover:text-accent hover:bg-accent/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                      isActive(href) ? "text-accent" : "text-foreground/80"
                    )}
                  >
                    {label}
                    {/* Active pill underline */}
                    {isActive(href) && (
                      <span className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-accent/60" />
                    )}
                  </Link>
                </li>
              ))}

              {/* Ürünler — custom dropdown */}
              <li className="relative">
                <button
                  ref={triggerRef}
                  type="button"
                  id="products-menu-button"
                  aria-haspopup="true"
                  aria-expanded={productsOpen}
                  onClick={() => setProductsOpen((o) => !o)}
                  className={cn(
                    "relative flex h-10 items-center gap-1 px-4 text-[13.5px] font-semibold",
                    "rounded-lg transition-colors duration-200 select-none",
                    "hover:text-accent hover:bg-accent/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                    isProductsActive || productsOpen
                      ? "text-accent"
                      : "text-foreground/80"
                  )}
                >
                  Ürünler
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      productsOpen && "rotate-180"
                    )}
                  />
                  {isProductsActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-accent/60" />
                  )}
                </button>

                {/* Mega-dropdown */}
                <div
                  ref={dropdownRef}
                  id="products-menu"
                  role="region"
                  aria-labelledby="products-menu-button"
                  className={cn(
                    "absolute left-1/2 top-[calc(100%+10px)] z-50 w-[420px] -translate-x-1/2",
                    "rounded-2xl border border-border/60 bg-white/98 backdrop-blur-xl",
                    "shadow-[0_20px_60px_-10px_rgba(44,62,80,0.18)]",
                    "overflow-hidden",
                    "transition-all duration-200 origin-top",
                    productsOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}
                >
                  {/* Dropdown header */}
                  <div className="flex items-center gap-2.5 border-b border-border/50 bg-[oklch(0.985_0.001_248)] px-5 py-3.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                      <Layers className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Sektöre Göre
                      </p>
                      <p className="text-[13px] font-semibold text-primary leading-none mt-0.5">
                        Ürünler & Çözümler
                      </p>
                    </div>
                  </div>

                  {/* Sector list */}
                  <div className="p-3">
                    <ul className="space-y-0.5" role="list">
                      {sectors.length === 0 ? (
                        <li className="flex items-center gap-2 px-3 py-3 text-[13px] text-muted-foreground">
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/50" />
                          Yükleniyor...
                        </li>
                      ) : (
                        sectors.map((sector) => {
                          const active = pathname === `/sektorler/${sector.slug}`
                          return (
                            <li key={sector.id}>
                              <Link
                                href={`/sektorler/${sector.slug}`}
                                onClick={() => setProductsOpen(false)}
                                className={cn(
                                  "group flex items-center justify-between rounded-xl px-4 py-2.5",
                                  "text-[13px] font-medium transition-all duration-150",
                                  active
                                    ? "bg-accent/8 text-accent"
                                    : "text-foreground/80 hover:bg-accent/5 hover:text-accent"
                                )}
                              >
                                <span>{sector.name}</span>
                                <ChevronRight
                                  className={cn(
                                    "h-3.5 w-3.5 transition-all duration-150",
                                    active
                                      ? "text-accent"
                                      : "text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5"
                                  )}
                                />
                              </Link>
                            </li>
                          )
                        })
                      )}
                    </ul>
                  </div>

                  {/* Footer CTA */}
                  <div className="border-t border-border/40 bg-gradient-to-r from-accent/5 to-transparent px-5 py-3">
                    <Link
                      href="/sektorler"
                      onClick={() => setProductsOpen(false)}
                      className="group flex items-center justify-between text-[12.5px] font-semibold text-accent hover:underline"
                    >
                      <span>Tüm Sektörleri Keşfet</span>
                      <div className="flex items-center gap-1 transition-transform duration-150 group-hover:translate-x-0.5">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  </div>
                </div>
              </li>

              {/* İletişim */}
              <li>
                <Link
                  href="/iletisim"
                  className={cn(
                    "relative flex h-10 items-center px-4 text-[13.5px] font-semibold",
                    "rounded-lg transition-colors duration-200",
                    "hover:text-accent hover:bg-accent/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                    isActive("/iletisim") ? "text-accent" : "text-foreground/80"
                  )}
                >
                  İletişim
                  {isActive("/iletisim") && (
                    <span className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-accent/60" />
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* ── Desktop Right ───────────────────────────── */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Phone mini-card */}
            <a
              href="tel:+902121234567"
              className="group hidden items-center gap-2.5 xl:flex"
              aria-label="Bizi arayın"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  "bg-accent/8 text-accent ring-1 ring-accent/20",
                  "transition-all duration-200 group-hover:bg-accent group-hover:text-white group-hover:ring-accent"
                )}
              >
                <Phone className="h-3.5 w-3.5" />
              </div>
              <div className="leading-none">
                <span className="block text-[10px] font-medium text-muted-foreground">
                  Bizi Arayın
                </span>
                <span className="block text-[13px] font-bold text-primary">
                  (212) 123 45 67
                </span>
              </div>
            </a>

            <div className="mx-0.5 h-8 w-px bg-border xl:block hidden" />

            {/* CTA Button */}
            <Button
              asChild
              size="sm"
              className={cn(
                "h-9 px-5 text-[13px] font-semibold",
                "bg-gradient-to-r from-accent to-[oklch(0.45_0.18_280)]",
                "hover:from-[oklch(0.42_0.17_265)] hover:to-[oklch(0.38_0.17_275)]",
                "text-white shadow-lg shadow-accent/25",
                "transition-all duration-200 hover:shadow-accent/40 hover:-translate-y-px",
                "border-0 rounded-xl"
              )}
            >
              <Link href="/iletisim" className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5" />
                Teklif Alın
              </Link>
            </Button>
          </div>

          {/* ── Mobile toggle ────────────────────────────── */}
          <button
            type="button"
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl lg:hidden",
              "text-foreground/70 transition-all duration-200",
              "hover:bg-accent/8 hover:text-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            )}
          >
            <span
              className={cn(
                "absolute transition-all duration-200",
                mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
              )}
            >
              <X className="h-5 w-5" />
            </span>
            <span
              className={cn(
                "absolute transition-all duration-200",
                mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
              )}
            >
              <Menu className="h-5 w-5" />
            </span>
          </button>
        </nav>
      </header>

      {/* ══════════════════════════════════════════════════
          MOBILE DRAWER — full-screen overlay
      ══════════════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-80 flex-col lg:hidden",
          "bg-white shadow-[−4px_0_40px_rgba(44,62,80,0.15)]",
          "transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Mobil menü"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.22_0.03_248)] shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" aria-hidden="true">
                <rect x="4" y="4" width="3" height="16" rx="1" fill="currentColor" />
                <rect x="7" y="4" width="9" height="2.5" rx="1" fill="currentColor" />
                <rect x="7" y="10.75" width="7" height="2.5" rx="1" fill="currentColor" />
                <rect x="7" y="17.5" width="9" height="2.5" rx="1" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[14px] font-black tracking-wide text-primary">ERKATEK</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Menüyü kapat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5" role="list">
            {[
              { label: "Ana Sayfa", href: "/" },
              { label: "Hakkımızda", href: "/hakkimizda" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3 text-[15px] font-semibold transition-all",
                    isActive(href)
                      ? "bg-accent/8 text-accent"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Ürünler accordion */}
            <li>
              <button
                type="button"
                onClick={() => setMobileProductsOpen((o) => !o)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-4 py-3",
                  "text-[15px] font-semibold transition-all",
                  isProductsActive || mobileProductsOpen
                    ? "bg-accent/8 text-accent"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )}
              >
                Ürünler
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    mobileProductsOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Accordion content */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  mobileProductsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <ul className="ml-3 mt-1 space-y-0.5 border-l-2 border-accent/20 pl-3" role="list">
                  {sectors.map((sector) => (
                    <li key={sector.id}>
                      <Link
                        href={`/sektorler/${sector.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2.5",
                          "text-[13.5px] font-medium transition-all",
                          pathname === `/sektorler/${sector.slug}`
                            ? "text-accent"
                            : "text-foreground/70 hover:text-foreground"
                        )}
                      >
                        {sector.name}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/sektorler"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-1 px-3 py-2 text-[12.5px] font-semibold text-accent hover:underline"
                    >
                      Tüm Sektörler
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <Link
                href="/iletisim"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3 text-[15px] font-semibold transition-all",
                  isActive("/iletisim")
                    ? "bg-accent/8 text-accent"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )}
              >
                İletişim
              </Link>
            </li>
          </ul>

          {/* Divider */}
          <div className="my-5 h-px bg-border" />

          {/* CTA */}
          <Button
            asChild
            className={cn(
              "w-full h-12 text-[14px] font-semibold rounded-xl",
              "bg-gradient-to-r from-accent to-[oklch(0.45_0.18_280)]",
              "hover:from-[oklch(0.42_0.17_265)] hover:to-[oklch(0.38_0.17_275)]",
              "text-white shadow-lg shadow-accent/25 border-0"
            )}
          >
            <Link href="/iletisim" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Teklif Alın
            </Link>
          </Button>

          {/* Contact info */}
          <div className="mt-6 space-y-3 rounded-xl bg-[oklch(0.985_0.001_248)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              İletişim
            </p>
            <a
              href="tel:+902121234567"
              className="flex items-center gap-3 text-[13px] text-foreground/70 hover:text-foreground transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Phone className="h-3.5 w-3.5" />
              </div>
              +90 (212) 123 45 67
            </a>
            <a
              href="mailto:info@erkatek.com"
              className="flex items-center gap-3 text-[13px] text-foreground/70 hover:text-foreground transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Mail className="h-3.5 w-3.5" />
              </div>
              info@erkatek.com
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
