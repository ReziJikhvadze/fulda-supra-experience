import heroImg from "@/assets/hero-table.jpg";
import { useTranslation } from "react-i18next";
import { Ornament } from "./Ornament";

export function Hero() {
  const { t } = useTranslation();
  return (
    <section id="top" className="relative h-screen min-h-[680px] w-full overflow-hidden bg-walnut">
      <img
        src={heroImg}
        alt="Georgian supra dinner table with khachapuri, khinkali and wine at Am Stockhaus Fulda"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover opacity-85"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-walnut/20 via-walnut/30 to-walnut/70" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--gold) 18%, transparent), transparent 60%)",
          animation: "var(--animate-flicker)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-cream">
        <span
          className="text-gold font-serif italic text-lg md:text-xl mb-6"
          style={{ animation: "var(--animate-fade-up)" }}
        >
          {t("hero.eyebrow")}
        </span>
        <h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-5xl text-balance"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "120ms" }}
        >
          {t("hero.title1")}
          <br />
          <span className="italic font-light">{t("hero.title2")}</span>
        </h1>
        <p
          className="mt-8 max-w-xl text-cream/80 text-base md:text-lg font-light leading-relaxed"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "240ms" }}
        >
          {t("hero.subtitle")}
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "360ms" }}
        >
          <a
            href="#menu"
            className="bg-gold text-walnut px-10 py-4 uppercase text-[11px] tracking-[0.25em] font-medium hover:bg-wine hover:text-cream transition-colors"
          >
            {t("hero.viewMenu")}
          </a>
          <a
            href="#reserve"
            className="border border-cream/40 text-cream px-10 py-4 uppercase text-[11px] tracking-[0.25em] font-medium hover:bg-cream hover:text-walnut transition-colors"
          >
            {t("hero.reserve")}
          </a>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-70">
          <span className="text-[10px] tracking-[0.3em] uppercase text-cream/60">{t("hero.scroll")}</span>
          <div className="w-px h-12 bg-gradient-to-b from-cream/60 to-transparent" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 pb-6">
        <Ornament />
      </div>
    </section>
  );
}
