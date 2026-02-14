import { z } from "zod"

/** Technical spec item schema */
const technicalSpecItemSchema = z.object({
  label: z.string().min(1, "Özellik adı zorunludur."),
  value: z.string().min(1, "Değer zorunludur."),
  unit: z.string().optional(),
})

/** Technical spec category schema */
const technicalSpecSchema = z.object({
  category: z.string().min(1, "Kategori adı zorunludur."),
  specs: z
    .array(technicalSpecItemSchema)
    .min(1, "Her kategoride en az 1 özellik olmalıdır."),
})

/** Technical specs data schema */
const technicalSpecsDataSchema = z.object({
  categories: z.array(technicalSpecSchema).default([]),
})

/** Validation schema for creating a new machine */
export const createMachineSchema = z.object({
  name: z
    .string()
    .min(3, "Makina adı en az 3 karakter olmalıdır.")
    .max(200, "Makina adı en fazla 200 karakter olabilir."),
  slug: z
    .string()
    .min(3, "Slug en az 3 karakter olmalıdır.")
    .max(220, "Slug en fazla 220 karakter olabilir.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug sadece küçük harf, rakam ve tire içerebilir."
    ),
  description: z
    .string()
    .min(20, "Açıklama en az 20 karakter olmalıdır."),
  shortDescription: z
    .string()
    .max(300, "Kısa açıklama en fazla 300 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  sectorId: z.string().min(1, "Sektör seçimi zorunludur."),
  images: z.array(z.url("Geçerli bir resim URL'si giriniz.")),
  mainImage: z
    .url("Geçerli bir resim URL'si giriniz.")
    .optional()
    .or(z.literal("")),
  technicalSpecs: technicalSpecsDataSchema,
  features: z.array(z.string().min(1, "Özellik boş bırakılamaz.")),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  metaTitle: z
    .string()
    .max(70, "Meta başlık en fazla 70 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, "Meta açıklama en fazla 160 karakter olabilir.")
    .optional()
    .or(z.literal("")),
})

/** Validation schema for updating a machine */
export const updateMachineSchema = createMachineSchema.partial()
