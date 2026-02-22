"use client"

import { useState } from "react"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
}

const channels = [
  { icon: Phone, title: "Telefon", value: "+90 (212) 123 45 67", href: "tel:+902121234567" },
  { icon: Mail, title: "E-posta", value: "info@erkatek.com", href: "mailto:info@erkatek.com" },
  { icon: MapPin, title: "Adres", value: "OSB 1. Cadde No:15, İstanbul", href: null },
  { icon: Clock, title: "Çalışma", value: "Pzt-Cum 08:00-18:00", href: null },
]

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", company: "", subject: "", message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      setStatus("success")
      setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "" })
    } catch {
      setStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Channels */}
      <section className="border-b py-10">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((ch) => (
              <Card key={ch.title} className="p-0 py-0 shadow-none">
                <CardContent className="flex items-start gap-3 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <ch.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {ch.title}
                    </p>
                    {ch.href ? (
                      <a href={ch.href} className="text-[14px] font-semibold text-primary hover:text-accent">
                        {ch.value}
                      </a>
                    ) : (
                      <p className="text-[14px] font-semibold text-primary">{ch.value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8">
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-accent">
                Mesaj Gönderin
              </p>
              <h2 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold text-primary">
                Size nasıl yardımcı olabiliriz?
              </h2>
            </div>

            {status === "success" && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <p className="text-[14px] font-semibold text-green-800">Mesajınız gönderildi!</p>
                  <p className="text-[13px] text-green-700">En kısa sürede dönüş yapacağız.</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="text-[14px] font-semibold text-red-800">Bir hata oluştu. Lütfen tekrar deneyin.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Ad Soyad <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Adınız Soyadınız"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    E-posta <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ornek@firma.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+90 (5XX) XXX XX XX"
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Firma</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Firma Adı"
                    autoComplete="organization"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Konu <span className="text-destructive">*</span>
                </Label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  autoComplete="off"
                >
                  <option value="">Konu Seçiniz</option>
                  <option value="teklif">Fiyat Teklifi</option>
                  <option value="bilgi">Ürün Bilgisi</option>
                  <option value="destek">Teknik Destek</option>
                  <option value="isbirligi">İş Birliği</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">
                  Mesajınız <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Projeniz hakkında bize bilgi verin..."
                  autoComplete="off"
                  className="resize-none"
                />
              </div>
              <Button type="submit" disabled={submitting} size="lg">
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Mesaj Gönder
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
