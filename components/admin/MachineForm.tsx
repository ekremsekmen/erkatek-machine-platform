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

      {/* Basic Info */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Temel Bilgiler</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="machine-name" className="mb-1.5 block text-sm font-medium">
                Makina Adı <span className="text-destructive">*</span>
              </label>
              <input
                id="machine-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Örn: Otomatik Paketleme Makinası"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="machine-slug" className="mb-1.5 block text-sm font-medium">
                Slug <span className="text-destructive">*</span>
              </label>
              <input
                id="machine-slug"
                name="slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="otomatik-paketleme-makinasi"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label htmlFor="machine-sector" className="mb-1.5 block text-sm font-medium">
              Sektör <span className="text-destructive">*</span>
            </label>
            <select
              id="machine-sector"
              name="sectorId"
              required
              value={formData.sectorId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sectorId: e.target.value }))
              }
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Sektör Seçin</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="machine-short-desc" className="mb-1.5 block text-sm font-medium">
              Kısa Açıklama
            </label>
            <input
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
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Kartlarda ve listelerde gösterilecek kısa açıklama"
              maxLength={300}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="machine-description" className="mb-1.5 block text-sm font-medium">
              Detaylı Açıklama <span className="text-destructive">*</span>
            </label>
            <textarea
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
              className="w-full resize-none rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Makina hakkında detaylı bilgi (en az 20 karakter)..."
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Görseller</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="machine-main-image" className="mb-1.5 block text-sm font-medium">
              Ana Görsel URL
            </label>
            <input
              id="machine-main-image"
              name="mainImage"
              type="url"
              value={formData.mainImage}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mainImage: e.target.value }))
              }
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="https://..."
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="machine-add-image" className="mb-1.5 block text-sm font-medium">
              Ek Görseller
            </label>
            <div className="flex gap-2">
              <input
                id="machine-add-image"
                name="newImage"
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Görsel URL'si ekleyin..."
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addImage()
                  }
                }}
              />
              <button
                type="button"
                onClick={addImage}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
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
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Öne Çıkan Özellikler</h2>
        <div className="flex gap-2">
          <label htmlFor="machine-add-feature" className="sr-only">Özellik ekle</label>
          <input
            id="machine-add-feature"
            name="newFeature"
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Özellik ekleyin..."
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addFeature()
              }
            }}
          />
          <button
            type="button"
            onClick={addFeature}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
          </button>
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
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Technical Specs */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Teknik Özellikler</h2>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            Kategori Ekle
          </button>
        </div>

        <div className="space-y-6">
          {formData.technicalSpecs.categories.map((cat, catIndex) => (
            <div key={catIndex} className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-3 flex items-center gap-3">
                <input
                  type="text"
                  value={cat.category}
                  onChange={(e) =>
                    updateCategoryName(catIndex, e.target.value)
                  }
                  className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Kategori adı (Örn: Boyutlar)"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(catIndex)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {cat.specs.map((spec, specIndex) => (
                  <div key={specIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) =>
                        updateSpec(catIndex, specIndex, "label", e.target.value)
                      }
                      className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Özellik"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpec(catIndex, specIndex, "value", e.target.value)
                      }
                      className="w-28 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Değer"
                    />
                    <input
                      type="text"
                      value={spec.unit || ""}
                      onChange={(e) =>
                        updateSpec(catIndex, specIndex, "unit", e.target.value)
                      }
                      className="w-20 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Birim"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(catIndex, specIndex)}
                      className="rounded-lg p-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addSpec(catIndex)}
                className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Özellik Ekle
              </button>
            </div>
          ))}

          {formData.technicalSpecs.categories.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Henüz teknik özellik kategorisi eklenmemiş.
            </p>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Ayarlar & SEO</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="machine-order" className="mb-1.5 block text-sm font-medium">
                Sıralama
              </label>
              <input
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
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                min={0}
                autoComplete="off"
              />
            </div>
            <div className="flex items-end gap-6">
              <label htmlFor="machine-active" className="flex items-center gap-2 text-sm">
                <input
                  id="machine-active"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                Aktif
              </label>
              <label htmlFor="machine-featured" className="flex items-center gap-2 text-sm">
                <input
                  id="machine-featured"
                  name="isFeatured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                Öne Çıkan
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="machine-meta-title" className="mb-1.5 block text-sm font-medium">
                Meta Başlık
              </label>
              <input
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
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="SEO başlığı (max 70 karakter)"
                maxLength={70}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="machine-meta-desc" className="mb-1.5 block text-sm font-medium">
                Meta Açıklama
              </label>
              <input
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
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="SEO açıklaması (max 160 karakter)"
                maxLength={160}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90",
            saving && "cursor-not-allowed opacity-70"
          )}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? "Değişiklikleri Kaydet" : "Makina Oluştur"}
        </button>
        <Link
          href="/admin/makinalar"
          className="rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          İptal
        </Link>
      </div>
    </form>
  )
}
