import type { Metadata } from "next"
import Link from "next/link"
import { Factory, Settings2, Eye, TrendingUp, Plus } from "lucide-react"
import { getDashboardStats } from "@/lib/queries/machines"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: "Toplam Sektör",
      value: stats.sectorCount,
      icon: Settings2,
      href: "/admin/sektorler",
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Toplam Makina",
      value: stats.machineCount,
      icon: Factory,
      href: "/admin/makinalar",
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Aktif Makina",
      value: stats.activeMachines,
      icon: Eye,
      href: "/admin/makinalar",
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Öne Çıkan",
      value: stats.featuredMachines,
      icon: TrendingUp,
      href: "/admin/makinalar",
      color: "text-orange-600 bg-orange-100",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Genel bakış ve istatistikler
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Hızlı İşlemler</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/sektorler"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Yeni Sektör Ekle</p>
              <p className="text-sm text-muted-foreground">
                Yeni bir sektör oluşturun
              </p>
            </div>
          </Link>
          <Link
            href="/admin/makinalar/yeni"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Yeni Makina Ekle</p>
              <p className="text-sm text-muted-foreground">
                Yeni bir makina oluşturun
              </p>
            </div>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Siteyi Görüntüle</p>
              <p className="text-sm text-muted-foreground">
                Public siteyi yeni sekmede açın
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
