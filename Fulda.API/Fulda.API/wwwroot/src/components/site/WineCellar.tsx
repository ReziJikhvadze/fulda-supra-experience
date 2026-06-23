import wineImg from "@/assets/wine-cellar.jpg";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { winesApi, type WineCategoryDto } from "@/lib/api";
import { Ornament } from "./Ornament";

export function WineCellar() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<WineCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const result = await winesApi.public();
      if (result.success && result.data) setCategories(result.data);
      setLoading(false);
    })();
  }, []);

  const wines = categories.flatMap((c) => c.wines.filter((w) => w.isAvailable));

  return (
    <section id="wine" className="relative py-32 md:py-40 bg-wine text-cream overflow-hidden">
      <img
        src={wineImg}
        alt="Qvevri clay wine vessels in a Georgian cellar"
        loading="lazy"
        width={1200}
        height={1500}
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-wine via-wine/90 to-wine" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <div className="text-center">
          <Ornament className="mb-8" />
          <span className="text-gold uppercase tracking-[0.35em] text-[10px] font-medium">
            {t("wine.eyebrow")}
          </span>
          <h2 className="mt-4 text-5xl md:text-7xl font-serif italic">{t("wine.title")}</h2>
          <p className="mt-8 max-w-2xl mx-auto text-cream/80 font-light text-lg leading-relaxed">
            {t("wine.body")}
          </p>
        </div>

        {loading ? (
          <p className="mt-20 text-center text-cream/70">{t("wine.loading", { defaultValue: "Loading wines…" })}</p>
        ) : wines.length === 0 ? (
          <p className="mt-20 text-center text-cream/70">{t("wine.empty", { defaultValue: "Wine list coming soon." })}</p>
        ) : (
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-px bg-cream/10">
            {wines.map((w) => (
              <div key={w.id} className="bg-wine p-8 hover:bg-walnut/40 transition-colors">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl">{w.name}</h3>
                  <span className="text-gold tabular-nums">€{w.price.toFixed(2)}</span>
                </div>
                {(w.country || w.year) && (
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-gold/90">
                    {[w.country, w.year].filter(Boolean).join(" · ")}
                  </span>
                )}
                {w.description && (
                  <p className="mt-3 text-cream/70 font-light text-sm leading-relaxed">{w.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
