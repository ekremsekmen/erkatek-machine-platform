import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slugifyLib from "slugify"

/**
 * Merge Tailwind CSS classes with conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-safe slug from a Turkish string.
 */
export function generateSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "tr",
    trim: true,
  })
}

/**
 * Format a date string for display in Turkish locale.
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

/**
 * Format a date with time for admin panel display.
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

/**
 * Truncate text to a specified length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}

/**
 * Validate an image file (type and size).
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): string | null {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]

  if (!allowedTypes.includes(file.type)) {
    return "Sadece JPEG, PNG, WebP ve AVIF formatları desteklenir."
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return `Dosya boyutu ${maxSizeMB}MB'dan küçük olmalıdır.`
  }

  return null
}

/**
 * Create pagination metadata.
 */
export function createPagination(
  totalCount: number,
  page: number,
  pageSize: number
) {
  return {
    page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  }
}
