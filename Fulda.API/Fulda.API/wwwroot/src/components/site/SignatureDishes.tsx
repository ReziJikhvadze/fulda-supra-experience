import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { menuApi, type MenuItemDto } from "@/lib/api";
import { Ornament } from "./Ornament";

export function SignatureDishes() {
  const { t } = useTranslation();
  const [dishes, setDishes] = useState<MenuItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const result = await menuApi.signaturePlates();
      if (result.success && result.data?.length) setDishes(result.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-walnut text-cream text-center">
        <p className="text-cream/60 font-light">Loading…</p>
      </section>
    );
  }

  if (dishes.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 bg-walnut text-cream">
      <div className="px-6 md:px-12 mb-16 text-center">
        <Ornament className="mb-8" />
        <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
          {t("signature.eyebrow")}
        </span>
        <h2 className="mt-3 text-5xl md:text-6xl font-serif italic">{t("signature.title")}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10">
        {dishes.map((d) => (
          <article
            key={d.id}
            className="group relative bg-walnut p-8 transition-colors duration-500 hover:bg-wine/30"
          >
            <div className="overflow-hidden aspect-square mb-6 bg-cream/5">
              {d.imageUrl ? (
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-cream/30 text-sm font-light">
                  No image
                </div>
              )}
            </div>
            <div className="flex justify-between items-baseline mb-2 gap-4">
              <h3 className="text-2xl font-serif">{d.name}</h3>
              <span className="text-gold font-light text-lg">€{d.price.toFixed(2)}</span>
            </div>
            {d.description && (
              <p className="text-sm leading-relaxed text-cream/60 font-light">{d.description}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
