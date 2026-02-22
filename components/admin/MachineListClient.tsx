"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Eye,
  EyeOff,
  Star,
} from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { deleteMachine } from "@/lib/actions/machine"
import type { MachineWithSector } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface MachineListClientProps {
  machines: MachineWithSector[]
}

export function MachineListClient({ machines }: MachineListClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (id: string) => {
    if (!confirm("Bu makinayı silmek istediğinize emin misiniz?")) return

    setDeleteId(id)
    startTransition(async () => {
      const result = await deleteMachine(id)
      if (!result.success) {
        alert(result.error)
      }
      setDeleteId(null)
    })
  }

  const filteredMachines = machines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sector.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Makinalar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Makinaları yönetin, ekleyin veya düzenleyin.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/makinalar/yeni">
            <Plus className="h-4 w-4" />
            Yeni Makina
          </Link>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Label htmlFor="machine-search" className="sr-only">Makina veya sektör ara</Label>
              <Input
                id="machine-search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                placeholder="Makina veya sektör ara..."
                autoComplete="off"
              />
            </div>
          </div>

          {filteredMachines.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Aramanızla eşleşen makina bulunamadı."
                  : "Henüz makina eklenmemiş."}
              </p>
              {!searchQuery && (
                <Button asChild variant="link" className="mt-4">
                  <Link href="/admin/makinalar/yeni">
                    <Plus className="h-4 w-4" />
                    İlk makinayı ekleyin
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Makina</TableHead>
                  <TableHead>Sektör</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                  <TableHead className="text-center">Öne Çıkan</TableHead>
                  <TableHead>Güncelleme</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-muted">
                          {machine.mainImage ? (
                            <Image
                              src={machine.mainImage}
                              alt={machine.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs font-bold text-muted-foreground">
                              {machine.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{machine.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {machine.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {machine.sector.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {machine.isActive ? (
                        <Eye className="mx-auto h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="mx-auto h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {machine.isFeatured && (
                        <Star className="mx-auto h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(machine.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            href={`/admin/makinalar/${machine.id}/duzenle`}
                            aria-label="Düzenle"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(machine.id)}
                          disabled={deleteId === machine.id || isPending}
                          className="hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Sil"
                        >
                          {deleteId === machine.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
