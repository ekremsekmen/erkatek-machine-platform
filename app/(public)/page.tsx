import type { Metadata } from "next"
import { getNavSectors } from "@/lib/queries/sectors"
import { LandingPage } from "@/components/landing/LandingPage"

export const metadata: Metadata = {
  title: "ERKATEK Makina | Endüstriyel Makina Çözümleri",
  description:
    "ERKATEK Makina - Endüstriyel makina üretiminde güvenilir çözüm ortağınız. Uluslararası standartlarda özel makina tasarımı ve üretimi.",
}

export default async function HomePage() {
  const sectors = await getNavSectors()

  return <LandingPage sectors={sectors} />
}
