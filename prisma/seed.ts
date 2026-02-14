import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // 1. Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@erkatek.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@erkatek.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  })
  console.log(`Admin user created: ${admin.email}`)

  // 2. Create sectors
  const sectorsData = [
    {
      name: "Gıda Sektörü",
      slug: "gida-sektoru",
      description:
        "Gıda işleme, paketleme ve depolama süreçlerinde kullanılan yüksek hijyen standartlarında endüstriyel makina çözümleri.",
      order: 1,
    },
    {
      name: "İlaç Sektörü",
      slug: "ilac-sektoru",
      description:
        "İlaç üretimi, ambalajlama ve kalite kontrol süreçlerinde GMP standartlarına uygun makina sistemleri.",
      order: 2,
    },
    {
      name: "Kimya Sektörü",
      slug: "kimya-sektoru",
      description:
        "Kimyasal işlem, karıştırma, depolama ve transfer sistemleri için endüstriyel makina çözümleri.",
      order: 3,
    },
    {
      name: "Otomotiv Sektörü",
      slug: "otomotiv-sektoru",
      description:
        "Otomotiv üretim hatları, montaj sistemleri ve otomasyon çözümleri.",
      order: 4,
    },
    {
      name: "Ambalaj Sektörü",
      slug: "ambalaj-sektoru",
      description:
        "Her türlü ambalajlama, shrinkleme ve etiketleme makinaları.",
      order: 5,
    },
  ]

  const sectors = await Promise.all(
    sectorsData.map((data) =>
      prisma.sector.upsert({
        where: { slug: data.slug },
        update: {},
        create: data,
      })
    )
  )
  console.log(`${sectors.length} sectors created`)

  // 3. Create sample machines
  const machinesData = [
    {
      name: "Otomatik Dolum Makinası",
      slug: "otomatik-dolum-makinasi",
      description:
        "Otomatik dolum makinamız, gıda sektöründe sıvı ve yarı katı ürünlerin hızlı ve hijyenik dolumunu sağlar. PLC kontrollü sistem ile dakikada 120 adet dolum kapasitesine ulaşır. Paslanmaz çelik gövdesi sayesinde uzun ömürlü ve temizlenmesi kolaydır. CE sertifikalıdır ve ISO 9001 standartlarına uygundur.",
      shortDescription:
        "Sıvı ve yarı katı ürünler için yüksek kapasiteli otomatik dolum çözümü.",
      sectorId: sectors[0].id,
      features: [
        "PLC kontrollü otomatik sistem",
        "Dakikada 120 adet dolum kapasitesi",
        "Paslanmaz çelik (AISI 304) gövde",
        "Dokunmatik ekran kontrol paneli",
        "CIP (Clean In Place) temizlik sistemi",
        "CE sertifikalı",
      ],
      technicalSpecs: {
        categories: [
          {
            category: "Boyutlar",
            specs: [
              { label: "Genişlik", value: "1200", unit: "mm" },
              { label: "Uzunluk", value: "2500", unit: "mm" },
              { label: "Yükseklik", value: "1800", unit: "mm" },
            ],
          },
          {
            category: "Motor Özellikleri",
            specs: [
              { label: "Güç", value: "5.5", unit: "kW" },
              { label: "Voltaj", value: "380", unit: "V" },
              { label: "Frekans", value: "50", unit: "Hz" },
            ],
          },
          {
            category: "Kapasite",
            specs: [
              { label: "Dolum Hızı", value: "120", unit: "adet/dk" },
              { label: "Dolum Hacmi", value: "50-1000", unit: "ml" },
              { label: "Ağırlık", value: "850", unit: "kg" },
            ],
          },
        ],
      },
      isActive: true,
      isFeatured: true,
      order: 1,
    },
    {
      name: "Endüstriyel Paketleme Sistemi",
      slug: "endustriyel-paketleme-sistemi",
      description:
        "Endüstriyel paketleme sistemimiz, çeşitli ürünlerin otomatik paketlenmesi için tasarlanmıştır. Yüksek hızlı servo motorlu yapısı ile saatte 3000 paket üretim kapasitesine sahiptir. Farklı paket boyutlarına kolayca uyarlanabilir. Entegre tartım sistemi ile gramaj kontrolü sağlar.",
      shortDescription:
        "Yüksek hızlı, çok yönlü endüstriyel paketleme çözümü.",
      sectorId: sectors[0].id,
      features: [
        "Servo motorlu yüksek hızlı sistem",
        "Saatte 3000 paket kapasitesi",
        "Otomatik gramaj kontrolü",
        "Farklı paket boyutlarına uyarlama",
        "Entegre barkod yazıcı",
        "Uzaktan izleme ve kontrol",
      ],
      technicalSpecs: {
        categories: [
          {
            category: "Boyutlar",
            specs: [
              { label: "Genişlik", value: "1500", unit: "mm" },
              { label: "Uzunluk", value: "3500", unit: "mm" },
              { label: "Yükseklik", value: "2200", unit: "mm" },
            ],
          },
          {
            category: "Performans",
            specs: [
              { label: "Paketleme Hızı", value: "3000", unit: "adet/saat" },
              { label: "Paket Boyutu", value: "50x50 - 400x300", unit: "mm" },
              { label: "Hassasiyet", value: "±0.5", unit: "g" },
            ],
          },
        ],
      },
      isActive: true,
      isFeatured: true,
      order: 2,
    },
    {
      name: "Karıştırma Reaktörü",
      slug: "karistirma-reaktoru",
      description:
        "Kimya sektörü için tasarlanan karıştırma reaktörümüz, yüksek basınç ve sıcaklık altında kimyasal prosesleri güvenli bir şekilde yürütür. Çift cidarlı yapısı ile ısıtma ve soğutma işlemleri etkili şekilde gerçekleştirilir. ATEX sertifikalı patlama korumalı motor ile güvenlik ön plandadır.",
      shortDescription:
        "Yüksek basınç ve sıcaklık için güvenli kimyasal proses çözümü.",
      sectorId: sectors[2].id,
      features: [
        "Çift cidarlı ısıtma/soğutma sistemi",
        "ATEX sertifikalı patlama korumalı motor",
        "Yüksek basınç dayanımı (10 bar)",
        "Otomatik sıcaklık kontrolü",
        "Paslanmaz çelik AISI 316L",
        "PID kontrol sistemi",
      ],
      technicalSpecs: {
        categories: [
          {
            category: "Tank Özellikleri",
            specs: [
              { label: "Kapasite", value: "5000", unit: "L" },
              { label: "Çap", value: "1800", unit: "mm" },
              { label: "Yükseklik", value: "2500", unit: "mm" },
              { label: "Basınç", value: "10", unit: "bar" },
            ],
          },
          {
            category: "Motor",
            specs: [
              { label: "Güç", value: "15", unit: "kW" },
              { label: "Devir", value: "0-300", unit: "rpm" },
            ],
          },
        ],
      },
      isActive: true,
      isFeatured: false,
      order: 3,
    },
  ]

  for (const data of machinesData) {
    await prisma.machine.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    })
  }
  console.log(`${machinesData.length} machines created`)

  console.log("Seeding completed successfully!")
  console.log("\nAdmin credentials:")
  console.log("  Email: admin@erkatek.com")
  console.log("  Password: admin123")
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
