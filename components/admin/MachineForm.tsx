"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Loader2,
  Plus,
  X,
  Trash2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { cn, generateSlug } from "@/lib/utils"
import { createMachine, updateMachine } from "@/lib/actions/machine"
import type { Machine } from "@/types"
import type { TechnicalSpecsData } from "@/types"

// ── shadcn bileşenleri ──────────────────────────────────────────────
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MachineFormProps {
  sectors: { id: string; name: string }[]
  machine?: Machine
}

export function MachineForm({ sectors, machine }: MachineFormProps) {
  const router = useRouter()
  const isEditing = !!machine

  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: machine?.name || "",
    slug: machine?.slug || "",
    description: machine?.description || "",
    shortDescription: machine?.shortDescription || "",
    sectorId: machine?.sectorId || "",
    mainImage: machine?.mainImage || "",
    images: machine?.images || ([] as string[]),
    features: machine?.features || ([] as string[]),
    technicalSpecs: (machine?.technicalSpecs as unknown as TechnicalSpecsData) || {
      categories: [],
    },
    isActive: machine?.isActive ?? true,
    isFeatured: machine?.isFeatured ?? false,
    order: machine?.order ?? 0,
    metaTitle: machine?.metaTitle || "",
    metaDescription: machine?.metaDescription || "",
  })

  // Image URL input state
  const [newImageUrl, setNewImageUrl] = useState("")
  // Feature input state
  const [newFeature, setNewFeature] = useState("")

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generateSlug(name),
    }))
  }

  /* ---- Image Handlers ---- */
  const addImage = () => {
    if (!newImageUrl.trim()) return
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }))
    setNewImageUrl("")
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  /* ---- Feature Handlers ---- */
  const addFeature = () => {
    if (!newFeature.trim()) return
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }))
    setNewFeature("")
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  /* ---- Technical Specs Handlers ---- */
  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecs: {
        categories: [
          ...prev.technicalSpecs.categories,
          { category: "", specs: [{ label: "", value: "", unit: "" }] },
        ],
      },
    }))
  }

  const removeCategory = (catIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecs: {
        categories: prev.technicalSpecs.categories.filter(
          (_, i) => i !== catIndex
        ),
      },
    }))
  }

  const updateCategoryName = (catIndex: number, name: string) => {
    setFormData((prev) => {
      const cats = [...prev.technicalSpecs.categories]
      cats[catIndex] = { ...cats[catIndex], category: name }
      return { ...prev, technicalSpecs: { categories: cats } }
    })
  }

  const addSpec = (catIndex: number) => {
    setFormData((prev) => {
      const cats = [...prev.technicalSpecs.categories]
      cats[catIndex] = {
        ...cats[catIndex],
        specs: [...cats[catIndex].specs, { label: "", value: "", unit: "" }],
      }
      return { ...prev, technicalSpecs: { categories: cats } }
    })
  }

  const removeSpec = (catIndex: number, specIndex: number) => {
    setFormData((prev) => {
      const cats = [...prev.technicalSpecs.categories]
      cats[catIndex] = {
        ...cats[catIndex],
        specs: cats[catIndex].specs.filter((_, i) => i !== specIndex),
      }
      return { ...prev, technicalSpecs: { categories: cats } }
    })
  }

  const updateSpec = (
    catIndex: number,
    specIndex: number,
    field: "label" | "value" | "unit",
    val: string
  ) => {
    setFormData((prev) => {
      const cats = [...prev.technicalSpecs.categories]
      const specs = [...cats[catIndex].specs]
      specs[specIndex] = { ...specs[specIndex], [field]: val }
      cats[catIndex] = { ...cats[catIndex], specs }
      return { ...prev, technicalSpecs: { categories: cats } }
    })
  }

  /* ---- Submit ---- */
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSaving(true)

    try {
      const result = isEditing
        ? await updateMachine(machine.id, formData)
        : await createMachine(formData)

      if (result.success) {
        router.push("/admin/makinalar")
        router.refresh()
      } else {
        alert(result.error)
      }
    } catch {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Back Link */}
      <Link
        href="/admin/makinalar"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Makinalar listesine dön
      </Link>

      {/* ── Temel Bilgiler ── */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Temel Bilgiler</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Makina Adı */}
            <div className="space-y-2">
              <Label htmlFor="machine-name">
                Makina Adı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="machine-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Otomatik Paketleme Makinası"
                autoComplete="off"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="machine-slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="machine-slug"
                name="slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="otomatik-paketleme-makinasi"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Sektör */}
          <div className="space-y-2">
            <Label htmlFor="machine-sector">
              Sektör <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.sectorId}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, sectorId: val }))
              }
              required
            >
              <SelectTrigger id="machine-sector">
                <SelectValue placeholder="Sektör Seçin" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kısa Açıklama */}
          <div className="space-y-2">
            <Label htmlFor="machine-short-desc">Kısa Açıklama</Label>
            <Input
              id="machine-short-desc"
              name="shortDescription"
              type="text"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              placeholder="Kartlarda ve listelerde gösterilecek kısa açıklama"
              maxLength={300}
              autoComplete="off"
            />
          </div>

          {/* Detaylı Açıklama */}
          <div className="space-y-2">
            <Label htmlFor="machine-description">
              Detaylı Açıklama <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="machine-description"
              name="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={6}
              className="resize-none"
              placeholder="Makina hakkında detaylı bilgi (en az 20 karakter)..."
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* ── Görseller ── */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Görseller</h2>
        <div className="space-y-4">
          {/* Ana Görsel */}
          <div className="space-y-2">
            <Label htmlFor="machine-main-image">Ana Görsel URL</Label>
            <Input
              id="machine-main-image"
              name="mainImage"
              type="url"
              value={formData.mainImage}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mainImage: e.target.value }))
              }
              placeholder="https://..."
              autoComplete="off"
            />
          </div>

          {/* Ek Görseller */}
          <div className="space-y-2">
            <Label htmlFor="machine-add-image">Ek Görseller</Label>
            <div className="flex gap-2">
              <Input
                id="machine-add-image"
                name="newImage"
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Görsel URL'si ekleyin..."
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addImage()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addImage}
                aria-label="Görsel ekle"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="group relative rounded-lg border bg-muted p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Görsel ${i + 1}`}
                      className="aspect-square w-full rounded object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImage(i)}
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label={`Görsel ${i + 1}'i kaldır`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Öne Çıkan Özellikler ── */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Öne Çıkan Özellikler</h2>
        <div className="flex gap-2">
          <Label htmlFor="machine-add-feature" className="sr-only">
            Özellik ekle
          </Label>
          <Input
            id="machine-add-feature"
            name="newFeature"
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Özellik ekleyin..."
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addFeature()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addFeature}
            aria-label="Özellik ekle"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {formData.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.features.map((feature, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`"${feature}" özelliğini kaldır`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Teknik Özellikler ── */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Teknik Özellikler</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCategory}
          >
            <Plus className="h-4 w-4" />
            Kategori Ekle
          </Button>
        </div>

        <div className="space-y-6">
          {formData.technicalSpecs.categories.map((cat, catIndex) => (
            <div key={catIndex} className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-3 flex items-center gap-3">
                <Input
                  type="text"
                  value={cat.category}
                  onChange={(e) =>
                    updateCategoryName(catIndex, e.target.value)
                  }
                  className="flex-1 font-medium"
                  placeholder="Kategori adı (Örn: Boyutlar)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCategory(catIndex)}
                  className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Kategoriyi sil"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {cat.specs.map((spec, specIndex) => (
                  <div key={specIndex} className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={spec.label}
                      onChange={(e) =>
                        updateSpec(catIndex, specIndex, "label", e.target.value)
                      }
                      className="flex-1"
                      placeholder="Özellik"
                    />
                    <Input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpec(catIndex, specIndex, "value", e.target.value)
                      }
                      className="w-28"
                      placeholder="Değer"
                    />
                    <Input
                      type="text"
                      value={spec.unit || ""}
                      onChange={(e) =>
                        updateSpec(catIndex, specIndex, "unit", e.target.value)
                      }
                      className="w-20"
                      placeholder="Birim"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpec(catIndex, specIndex)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      aria-label="Özelliği sil"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => addSpec(catIndex)}
                className="mt-2 h-auto p-0 text-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                Özellik Ekle
              </Button>
            </div>
          ))}

          {formData.technicalSpecs.categories.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Henüz teknik özellik kategorisi eklenmemiş.
            </p>
          )}
        </div>
      </div>

      {/* ── Ayarlar & SEO ── */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Ayarlar & SEO</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Sıralama */}
            <div className="space-y-2">
              <Label htmlFor="machine-order">Sıralama</Label>
              <Input
                id="machine-order"
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

            {/* Toggle'lar */}
            <div className="flex items-end gap-6 pb-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="machine-active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="machine-active" className="cursor-pointer">
                  Aktif
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="machine-featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="machine-featured" className="cursor-pointer">
                  Öne Çıkan
                </Label>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="machine-meta-title">Meta Başlık</Label>
              <Input
                id="machine-meta-title"
                name="metaTitle"
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaTitle: e.target.value,
                  }))
                }
                placeholder="SEO başlığı (max 70 karakter)"
                maxLength={70}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machine-meta-desc">Meta Açıklama</Label>
              <Input
                id="machine-meta-desc"
                name="metaDescription"
                type="text"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                placeholder="SEO açıklaması (max 160 karakter)"
                maxLength={160}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? "Değişiklikleri Kaydet" : "Makina Oluştur"}
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/admin/makinalar">İptal</Link>
        </Button>
      </div>
    </form>
  )
}
