import { useTranslation } from "react-i18next";
import { Ornament } from "./Ornament";

export function Events() {
  const { t } = useTranslation();
  const events = t("events.list", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <section id="events" className="py-24 md:py-32 bg-cream text-walnut">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-16">
          <Ornament className="mb-8" />
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
            {t("events.eyebrow")}
          </span>
          <h2 className="mt-3 text-5xl md:text-6xl font-serif italic text-wine">
            {t("events.title")}
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-walnut/70 font-light text-lg leading-relaxed">
            {t("events.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-walnut/10">
          {events.map((e, i) => (
            <article
              key={i}
              className="bg-cream p-10 md:p-14 hover:bg-wine hover:text-cream transition-colors duration-500 group"
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-serif italic text-gold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-walnut/40 group-hover:text-cream/60">
                  {t("events.required")}
                </span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl mb-4">{e.title}</h3>
              <p className="font-light leading-relaxed text-walnut/75 group-hover:text-cream/80">
                {e.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
