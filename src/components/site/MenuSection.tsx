import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { menu } from "@/lib/menu-data";
import { Ornament } from "./Ornament";

export function MenuSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState<string>("all");

  const visible = useMemo(
    () => (active === "all" ? menu : menu.filter((c) => c.id === active)),
    [active],
  );

  return (
    <section id="menu" className="py-24 md:py-32 bg-cream text-walnut">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-12">
          <Ornament className="mb-6" />
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
            {t("menu.eyebrow")}
          </span>
          <h2 className="mt-3 text-5xl md:text-6xl font-serif italic text-wine">
            {t("menu.title")}
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-walnut/70 font-light">{t("menu.subtitle")}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {[{ id: "all", name: t("menu.all") }, ...menu.map((c) => ({ id: c.id, name: t(`menu.categories.${c.id}`) }))].map((c) => (
            <button
              key={c.id}
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
              <h3 className="font-serif italic text-3xl text-wine mb-2">
                {t(`menu.categories.${cat.id}`)}
              </h3>
              <div className="h-px w-16 bg-gold mb-8" />
              <ul className="space-y-6">
                {cat.items.map((item) => (
                  <li key={item.id} className="group">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-xl text-walnut">
                        {t(`menu.items.${item.id}.name`)}
                      </span>
                      <span className="flex-1 mx-2 border-b border-dotted border-walnut/25 translate-y-[-4px]" />
                      <span className="text-gold font-light tabular-nums">€{item.price}</span>
                    </div>
                    <p className="mt-1 text-sm text-walnut/65 font-light leading-relaxed max-w-md">
                      {t(`menu.items.${item.id}.desc`)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
