import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { reservationsApi } from "@/lib/api";
import { Ornament } from "./Ornament";

export function Reservation() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    name: z.string().trim().min(2, t("reservation.errors.name")).max(80),
    phone: z.string().trim().min(5, t("reservation.errors.phone")).max(30),
    email: z.string().trim().email(t("reservation.errors.email")).max(120),
    date: z
      .string()
      .min(1, t("reservation.errors.date"))
      .refine((d) => d >= new Date().toISOString().slice(0, 10), t("reservation.errors.pastDate")),
    time: z.string().min(1, t("reservation.errors.time")),
    guests: z.coerce.number().min(1).max(20),
    notes: z.string().max(500).optional(),
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("reservation.errors.generic"));
      return;
    }

    setLoading(true);
    try {
      const result = await reservationsApi.create({
        customerName: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        reservationDate: parsed.data.date,
        reservationTime: parsed.data.time,
        guestCount: parsed.data.guests,
        specialRequest: parsed.data.notes,
      });

      if (!result.success) {
        setError(result.errors?.[0] ?? result.message ?? t("reservation.errors.generic"));
        return;
      }

      setSubmitted(true);
    } catch {
      setError(t("reservation.errors.network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reserve" className="py-24 md:py-32 bg-walnut text-cream">
      <div className="mx-auto max-w-6xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
        <div>
          <Ornament className="mb-8 justify-start" />
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
            {t("reservation.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif italic">{t("reservation.title")}</h2>
          <p className="mt-8 text-cream/75 font-light text-lg leading-relaxed">
            {t("reservation.body")}
          </p>

          <div className="mt-12 space-y-6">
            <a href="tel:+4906611234567" className="flex items-center gap-4 text-cream/90 hover:text-gold transition-colors">
              <span className="text-gold font-serif italic">{t("reservation.call")}</span>
              <span className="text-lg">+49 (0) 661 123 4567</span>
            </a>
            <a href="https://wa.me/4906611234567" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-cream/90 hover:text-gold transition-colors">
              <span className="text-gold font-serif italic">{t("reservation.whatsapp")}</span>
              <span className="text-lg">{t("reservation.whatsappCta")}</span>
            </a>
          </div>
        </div>

        {submitted ? (
          <div className="border border-gold/40 p-12 text-center">
            <h3 className="font-serif italic text-3xl text-gold mb-4">{t("reservation.successTitle")}</h3>
            <p className="text-cream/80 font-light leading-relaxed">{t("reservation.successBody")}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field name="name" placeholder={t("reservation.name")} />
              <Field name="phone" placeholder={t("reservation.phone")} type="tel" />
            </div>
            <Field name="email" placeholder={t("reservation.email")} type="email" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field name="date" type="date" min={new Date().toISOString().slice(0, 10)} />
              <Field name="time" type="time" />
              <select
                name="guests"
                defaultValue="2"
                className="bg-transparent border-b border-cream/25 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n} className="bg-walnut text-cream">
                    {n} {n === 1 ? t("reservation.guest") : t("reservation.guests")}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              name="notes"
              placeholder={t("reservation.notes")}
              rows={3}
              className="w-full bg-transparent border-b border-cream/25 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
            />
            {error && <p className="text-clay text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-walnut py-4 uppercase text-[11px] tracking-[0.25em] font-medium hover:bg-cream transition-colors disabled:opacity-60"
            >
              {loading ? t("reservation.submitting") : t("reservation.submit")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ name, placeholder, type = "text", min }: { name: string; placeholder?: string; type?: string; min?: string }) {
  return (
    <input
      name={name}
      type={type}
      min={min}
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-cream/25 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
    />
  );
}
