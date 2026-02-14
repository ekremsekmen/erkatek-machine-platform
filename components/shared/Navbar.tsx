"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, Mail, ArrowRight, Menu, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface SectorItem {
  id: string
  name: string
  slug: string
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [sectors, setSectors] = useState<SectorItem[]>([])
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let ticking = false
    let lastScrolled = window.scrollY > 10

    requestAnimationFrame(() => {
      setScrolled(window.scrollY > 10)
    })

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10
          if (isScrolled !== lastScrolled) {
            lastScrolled = isScrolled
            setScrolled(isScrolled)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  useEffect(() => {
    requestAnimationFrame(() => setSheetOpen(false))
  }, [pathname])

  useEffect(() => {
    fetch("/api/sectors")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setSectors(data as SectorItem[])
      })
      .catch(() => {})
  }, [])

  const isProductsActive =
    pathname.startsWith("/sektorler") || pathname.startsWith("/makinalar")

  return (
    <>
      {/* ── Top bar ── */}
      <div className="hidden border-b border-border/70 bg-primary lg:block">
        <div className="container-page flex h-9 items-center justify-between text-[12px] text-white/70">
          <div className="flex items-center divide-x divide-white/15">
            <a
              href="tel:+902121234567"
              className="flex items-center gap-1.5 pr-4 transition-colors hover:text-white"
            >
              <Phone className="h-3 w-3" />
              +90 (212) 123 45 67
            </a>
            <a
              href="mailto:info@erkatek.com"
              className="flex items-center gap-1.5 pl-4 transition-colors hover:text-white"
            >
              <Mail className="h-3 w-3" />
              info@erkatek.com
            </a>
          </div>
          <span className="text-white/50">Pzt – Cum: 08:00 – 18:00</span>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white will-change-[box-shadow] transition-shadow duration-200",
          scrolled ? "shadow-md" : "border-b shadow-none"
        )}
      >
        <nav className="container-page flex h-16 items-center justify-between lg:h-17">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-[14px] font-black text-white shadow-sm shadow-accent/20">
              E
            </div>
            <div className="leading-none">
              <span className="block text-[15px] font-extrabold tracking-tight text-primary">
                ERKATEK
              </span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Makina
              </span>
            </div>
          </Link>

          {/* Desktop navigation — shadcn NavigationMenu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* Ana Sayfa */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link
                    href="/"
                    className={cn(pathname === "/" && "text-accent")}
                  >
                    Ana Sayfa
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Hakkımızda */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link
                    href="/hakkimizda"
                    className={cn(
                      pathname.startsWith("/hakkimizda") && "text-accent"
                    )}
                  >
                    Hakkımızda
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Ürünler — Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(isProductsActive && "text-accent")}
                >
                  Ürünler
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[320px] p-4">
                    <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Sektöre Göre Ürünler
                    </p>
                    <ul className="space-y-0.5">
                      {sectors.length === 0 ? (
                        <li className="px-2 py-3 text-[13px] text-muted-foreground">
                          Yükleniyor...
                        </li>
                      ) : (
                        sectors.map((sector) => (
                          <li key={sector.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/sektorler/${sector.slug}`}
                                className={cn(
                                  "flex items-center justify-between rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors hover:bg-muted",
                                  pathname === `/sektorler/${sector.slug}`
                                    ? "bg-accent/5 text-accent"
                                    : "text-foreground"
                                )}
                              >
                                {sector.name}
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className="mt-2 border-t pt-2">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/sektorler"
                          className="block px-3 py-2 text-[12px] font-semibold text-accent hover:underline"
                        >
                          Tüm Sektörleri Gör &rarr;
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* İletişim */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link
                    href="/iletisim"
                    className={cn(
                      pathname.startsWith("/iletisim") && "text-accent"
                    )}
                  >
                    İletişim
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="tel:+902121234567"
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/8 text-accent">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <div className="hidden leading-none xl:block">
                <span className="block text-[10px] font-medium text-muted-foreground">
                  Bizi Arayın
                </span>
                <span className="block text-[13px] font-bold text-primary">
                  (212) 123 45 67
                </span>
              </div>
            </a>

            <div className="mx-1 h-8 w-px bg-border" />

            <Button asChild size="sm">
              <Link href="/iletisim" className="gap-2">
                Teklif Alın
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile — Sheet trigger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Menüyü aç"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-75 p-0">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle className="text-left text-[14px] font-bold">
                  Menü
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigasyon menüsü
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col overflow-y-auto px-4 py-4">
                {/* Links */}
                <div className="space-y-1">
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-[15px] font-semibold transition-colors",
                      pathname === "/"
                        ? "bg-accent/5 text-accent"
                        : "text-primary hover:bg-muted"
                    )}
                  >
                    Ana Sayfa
                  </Link>

                  <Link
                    href="/hakkimizda"
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-[15px] font-semibold transition-colors",
                      pathname.startsWith("/hakkimizda")
                        ? "bg-accent/5 text-accent"
                        : "text-primary hover:bg-muted"
                    )}
                  >
                    Hakkımızda
                  </Link>

                  {/* Ürünler — Accordion */}
                  <div>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-4 py-3 text-[15px] font-semibold transition-colors",
                        isProductsActive
                          ? "bg-accent/5 text-accent"
                          : "text-primary hover:bg-muted"
                      )}
                      onClick={() =>
                        setMobileProductsOpen(!mobileProductsOpen)
                      }
                    >
                      Ürünler
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          mobileProductsOpen && "rotate-90"
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        mobileProductsOpen ? "max-h-125" : "max-h-0"
                      )}
                    >
                      <div className="ml-4 space-y-0.5 border-l py-2 pl-4">
                        {sectors.map((sector) => (
                          <Link
                            key={sector.id}
                            href={`/sektorler/${sector.slug}`}
                            className={cn(
                              "block rounded-md px-3 py-2 text-[14px] font-medium transition-colors",
                              pathname === `/sektorler/${sector.slug}`
                                ? "text-accent"
                                : "text-muted-foreground hover:text-primary"
                            )}
                          >
                            {sector.name}
                          </Link>
                        ))}
                        <Link
                          href="/sektorler"
                          className="block px-3 py-2 text-[12px] font-semibold text-accent hover:underline"
                        >
                          Tüm Sektörler &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/iletisim"
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-[15px] font-semibold transition-colors",
                      pathname.startsWith("/iletisim")
                        ? "bg-accent/5 text-accent"
                        : "text-primary hover:bg-muted"
                    )}
                  >
                    İletişim
                  </Link>
                </div>

                {/* CTA */}
                <div className="mt-6 border-t pt-6">
                  <Button asChild className="w-full">
                    <Link href="/iletisim" className="gap-2">
                      Teklif Alın
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Contact */}
                <div className="mt-6 space-y-3 px-1">
                  <a
                    href="tel:+902121234567"
                    className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-4 w-4 text-accent" />
                    +90 (212) 123 45 67
                  </a>
                  <a
                    href="mailto:info@erkatek.com"
                    className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4 text-accent" />
                    info@erkatek.com
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
    </>
  )
}
