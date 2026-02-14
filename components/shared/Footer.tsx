import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const links = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Ürünler", href: "/sektorler" },
  { label: "İletişim", href: "/iletisim" },
]

export function Footer() {
  return (
    <footer className="border-t bg-primary text-white">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-[13px] font-extrabold text-white">
                E
              </div>
              <div className="leading-none">
                <span className="block text-[14px] font-bold tracking-tight">
                  ERKATEK
                </span>
                <span className="block text-[8px] font-semibold tracking-[0.18em] text-white/50">
                  MAKİNA
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-65 text-[14px] leading-relaxed text-white/60">
              Endüstriyel makina üretiminde güvenilir çözüm ortağınız.
              Uluslararası standartlarda üretim.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-white/40">
              Sayfalar
            </h3>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-white/40">
              İletişim
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+902121234567"
                  className="flex items-center gap-2.5 text-[14px] text-white/60 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  +90 (212) 123 45 67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@erkatek.com"
                  className="flex items-center gap-2.5 text-[14px] text-white/60 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" />
                  info@erkatek.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-[14px] text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>OSB 1. Cadde No:15, İstanbul</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-white/40">
              Çalışma Saatleri
            </h3>
            <div className="space-y-2 text-[14px]">
              <div className="flex justify-between text-white/60">
                <span>Pazartesi – Cuma</span>
                <span className="text-white/80">08:00 – 18:00</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Cumartesi</span>
                <span className="text-white/80">09:00 – 14:00</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Pazar</span>
                <span className="text-white/50">Kapalı</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <Separator className="bg-white/10" />
      <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-[12px] text-white/40 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} ERKATEK Makina. Tüm hakları saklıdır.</p>
        <div className="flex gap-5">
          <Link href="#" className="hover:text-white/60">Gizlilik Politikası</Link>
          <Link href="#" className="hover:text-white/60">Kullanım Şartları</Link>
        </div>
      </div>
    </footer>
  )
}
