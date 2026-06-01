import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { menuApi, type MenuCategoryDto } from "@/lib/api";
import { Ornament } from "./Ornament";

export function MenuSection() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<MenuCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const result = await menuApi.public();
      if (result.success && result.data) setCategories(result.data);
      setLoading(false);
    })();
  }, []);

  const visible = useMemo(
    () => (active === "all" ? categories : categories.filter((c) => String(c.id) === active)),
    [active, categories],
  );

  const tabs = useMemo(
    () => [{ id: "all", name: t("menu.all") }, ...categories.map((c) => ({ id: String(c.id), name: c.name }))],
    [categories, t],
  );

  return (
    <section id="menu" className="py-24 md:py-32 bg-cream text-walnut">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-12">
          <Ornament className="mb-6" />
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
            {t("menu.eyebrow")}
          </span>
          <h2 className="mt-3 text-5xl md:text-6xl font-serif italic text-wine">{t("menu.title")}</h2>
          <p className="mt-6 max-w-xl mx-auto text-walnut/70 font-light">{t("menu.subtitle")}</p>
        </div>

        {loading ? (
          <p className="text-center text-walnut/60">{t("menu.loading", { defaultValue: "Loading menu…" })}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-walnut/60">{t("menu.empty", { defaultValue: "Menu coming soon." })}</p>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              {tabs.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={`px-5 py-2 text-[11px] uppercase tracking-[0.2em] border transition-colors ${
                    active === c.id
                      ? "bg-wine text-cream border-wine"
                      : "border-walnut/20 text-walnut/70 hover:border-wine hover:text-wine"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
              {visible.map((cat) => (
                <div key={cat.id} className="break-inside-avoid">
                  <h3 className="font-serif italic text-3xl text-wine mb-2">{cat.name}</h3>
                  <div className="h-px w-16 bg-gold mb-8" />
                  <ul className="space-y-6">
                    {cat.items.map((item) => (
                      <li key={item.id} className="group">
                        <div className="flex items-baseline gap-3">
                          <span className="font-serif text-xl text-walnut">{item.name}</span>
                          <span className="flex-1 mx-2 border-b border-dotted border-walnut/25 translate-y-[-4px]" />
                          <span className="text-gold font-light tabular-nums">€{item.price.toFixed(2)}</span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm text-walnut/65 font-light leading-relaxed max-w-md">
                            {item.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
