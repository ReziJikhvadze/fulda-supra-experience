import wineImg from "@/assets/wine-cellar.jpg";
import { useTranslation } from "react-i18next";
import { Ornament } from "./Ornament";

const wineKeys = ["saperavi", "rkatsiteli", "mukuzani", "kindzmarauli"] as const;

export function WineCellar() {
  const { t } = useTranslation();
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

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-px bg-cream/10">
          {wineKeys.map((k) => (
            <div key={k} className="bg-wine p-8 hover:bg-walnut/40 transition-colors">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl">{t(`wine.items.${k}.name`)}</h3>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                  {t(`wine.items.${k}.region`)}
                </span>
              </div>
              <p className="mt-3 text-cream/70 font-light text-sm leading-relaxed">
                {t(`wine.items.${k}.note`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="#reserve"
            className="inline-block px-12 py-4 border border-gold text-gold text-[11px] uppercase tracking-[0.25em] hover:bg-gold hover:text-wine transition-colors"
          >
            {t("wine.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
