import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { menuApi, type MenuCategoryDto, type MenuItemDto } from "@/lib/api";
import { Ornament } from "./Ornament";

type Lang = "en" | "de" | "ka";

function pickLang(language: string): Lang {
  const base = language.split("-")[0];
  return base === "de" || base === "ka" ? base : "en";
}

function localizedCategory(cat: MenuCategoryDto, lang: Lang): string {
  if (lang === "de") return cat.nameDe || cat.name;
  if (lang === "ka") return cat.nameKa || cat.name;
  return cat.name;
}

function localizedName(item: MenuItemDto, lang: Lang): string {
  if (lang === "de") return item.nameDe || item.name;
  if (lang === "ka") return item.nameKa || item.name;
  return item.name;
}

function localizedDescription(item: MenuItemDto, lang: Lang): string {
  if (lang === "de") return item.descriptionDe || item.description || "";
  if (lang === "ka") return item.descriptionKa || item.description || "";
  return item.description || "";
}

export function MenuSection() {
  const { t, i18n } = useTranslation();
  const lang = pickLang(i18n.language);
  const [categories, setCategories] = useState<MenuCategoryDto[]>([]);
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    void menuApi.public().then((result) => {
      if (cancelled) return;
      if (result.success && result.data) setCategories(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const tabs = useMemo(
    () => [
      { key: "all", label: t("menu.all") },
      ...categories.map((c) => ({ key: String(c.id), label: localizedCategory(c, lang) })),
    ],
    [categories, lang, t],
  );

  const visible = useMemo(
    () => (active === "all" ? categories : categories.filter((c) => String(c.id) === active)),
    [active, categories],
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

        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {tabs.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              className={`px-5 py-2 text-[11px] uppercase tracking-[0.2em] border transition-colors ${
                active === c.key
                  ? "bg-wine text-cream border-wine"
                  : "border-walnut/20 text-walnut/70 hover:border-wine hover:text-wine"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {visible.map((cat) => (
            <div key={cat.id} className="break-inside-avoid">
              <h3 className="font-serif italic text-3xl text-wine mb-2">{localizedCategory(cat, lang)}</h3>
              <div className="h-px w-16 bg-gold mb-8" />
              <ul className="space-y-6">
                {cat.items.map((item) => {
                  const desc = localizedDescription(item, lang);
                  return (
                    <li key={item.id} className="group">
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-xl text-walnut">{localizedName(item, lang)}</span>
                        <span className="flex-1 mx-2 border-b border-dotted border-walnut/25 translate-y-[-4px]" />
                        <span className="text-gold font-light tabular-nums">€{item.price.toFixed(2)}</span>
                      </div>
                      {desc && (
                        <p className="mt-1 text-sm text-walnut/65 font-light leading-relaxed max-w-md">{desc}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
