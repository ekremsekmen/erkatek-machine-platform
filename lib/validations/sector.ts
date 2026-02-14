import { z } from "zod"

/** Validation schema for creating a new sector */
export const createSectorSchema = z.object({
  name: z
    .string()
    .min(2, "Sektör adı en az 2 karakter olmalıdır.")
    .max(100, "Sektör adı en fazla 100 karakter olabilir."),
  slug: z
    .string()
    .min(2, "Slug en az 2 karakter olmalıdır.")
    .max(120, "Slug en fazla 120 karakter olabilir.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug sadece küçük harf, rakam ve tire içerebilir."
    ),
  description: z
    .string()
    .max(2000, "Açıklama en fazla 2000 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  image: z.union([z.url("Geçerli bir resim URL'si giriniz."), z.literal("")]).optional(),
  order: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

/** Validation schema for updating a sector */
export const updateSectorSchema = createSectorSchema.partial()
