import { z } from "zod"

/** Login form validation schema */
export const loginSchema = z.object({
  email: z
    .email("Geçerli bir e-posta adresi giriniz.")
    .min(1, "E-posta adresi zorunludur."),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır.")
    .max(100, "Şifre en fazla 100 karakter olabilir."),
})

