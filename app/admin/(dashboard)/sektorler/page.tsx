"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react"
import { generateSlug } from "@/lib/utils"
import type { Sector } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminSectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSector, setEditingSector] = useState<Sector | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: 0,
    isActive: true,
  })

  const fetchSectors = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sectors")
      if (res.ok) {
        const data = await res.json()
        setSectors(data)
      }
    } catch (error) {
      console.error("Failed to fetch sectors:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSectors()
  }, [fetchSectors])

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      order: 0,
      isActive: true,
    })
    setEditingSector(null)
    setShowForm(false)
  }

  const openEditForm = (sector: Sector) => {
    setEditingSector(sector)
    setFormData({
      name: sector.name,
      slug: sector.slug,
      description: sector.description || "",
      image: sector.image || "",
      order: sector.order,
      isActive: sector.isActive,
    })
    setShowForm(true)
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingSector ? prev.slug : generateSlug(name),
    }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingSector
        ? `/api/admin/sectors/${editingSector.id}`
        : "/api/admin/sectors"

      const res = await fetch(url, {
        method: editingSector ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchSectors()
        resetForm()
      } else {
        const error = await res.json()
        alert(error.error || "Bir hata oluştu.")
      }
    } catch {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu sektörü silmek istediğinize emin misiniz? İlişkili tüm makinalar da silinecektir.")) {
      return
    }

    setDeleteId(id)
    try {
      const res = await fetch(`/api/admin/sectors/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        await fetchSectors()
      } else {
        alert("Silme işlemi başarısız.")
      }
    } catch {
      alert("Bir hata oluştu.")
    } finally {
      setDeleteId(null)
    }
  }

  const filteredSectors = sectors.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sektörler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sektörleri yönetin, ekleyin veya düzenleyin.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Yeni Sektör
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>
              {editingSector ? "Sektörü Düzenle" : "Yeni Sektör Ekle"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sector-name">
                    Sektör Adı <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sector-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Örn: Gıda Sektörü"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector-slug">
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sector-slug"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="gida-sektoru"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector-description">Açıklama</Label>
                <Textarea
                  id="sector-description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Sektör açıklaması..."
                  autoComplete="off"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="sector-image">Görsel URL</Label>
                  <Input
                    id="sector-image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, image: e.target.value }))
                    }
                    placeholder="https://..."
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector-order">Sıralama</Label>
                  <Input
                    id="sector-order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    min={0}
                    autoComplete="off"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sector-active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="sector-active" className="cursor-pointer">Aktif</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {editingSector ? "Güncelle" : "Kaydet"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search & Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Label htmlFor="sector-search" className="sr-only">Sektör ara</Label>
              <Input
                id="sector-search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                placeholder="Sektör ara..."
                autoComplete="off"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSectors.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Aramanızla eşleşen sektör bulunamadı."
                  : "Henüz sektör eklenmemiş."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sektör Adı</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Sıra</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSectors.map((sector) => (
                  <TableRow key={sector.id}>
                    <TableCell className="font-medium">{sector.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {sector.slug}
                    </TableCell>
                    <TableCell className="text-center">{sector.order}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={sector.isActive ? "default" : "secondary"}>
                        {sector.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditForm(sector)}
                          aria-label="Düzenle"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(sector.id)}
                          disabled={deleteId === sector.id}
                          className="hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Sil"
                        >
                          {deleteId === sector.id ? (
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
