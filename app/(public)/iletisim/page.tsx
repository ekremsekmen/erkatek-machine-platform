import type { Metadata } from "next"
import Link from "next/link"
import { ContactForm } from "@/components/public/ContactForm"

export const metadata: Metadata = {
  title: "İletişim | ERKATEK Makina",
  description:
    "ERKATEK Makina ile iletişime geçin. Projeleriniz için ücretsiz keşif ve teklif alın.",
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted py-16 md:py-20">
        <div className="container-page">
          <nav className="mb-6 text-[13px] text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Ana Sayfa</Link></li>
              <li className="text-border">/</li>
              <li className="text-primary">İletişim</li>
            </ol>
          </nav>
          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.1] text-primary">
            İletişim
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            Projeleriniz için bizimle iletişime geçin.
          </p>
        </div>
      </section>

      <ContactForm />
    </>
  )
}
