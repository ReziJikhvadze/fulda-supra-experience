import { useTranslation } from "react-i18next";
import supraImg from "@/assets/heritage-supra.jpg";
import qvevriImg from "@/assets/heritage-qvevri.jpg";
import georgiaImg from "@/assets/heritage-georgia.jpg";
import { Ornament } from "./Ornament";

const chapters = [
  { key: "supra", img: supraImg, ratio: "aspect-[4/3]" },
  { key: "qvevri", img: qvevriImg, ratio: "aspect-[4/5]" },
  { key: "georgia", img: georgiaImg, ratio: "aspect-[4/3]" },
] as const;

export function Heritage() {
  const { t } = useTranslation();
  const facts = t("heritage.facts", { returnObjects: true }) as {
    value: string;
    label: string;
  }[];

  return (
    <section id="heritage" className="bg-cream text-walnut py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-20">
          <Ornament className="mb-8" />
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
            {t("heritage.eyebrow")}
          </span>
          <h2 className="mt-3 text-5xl md:text-6xl font-serif italic text-wine">
            {t("heritage.title")}
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-walnut/70 font-light text-lg leading-relaxed">
            {t("heritage.subtitle")}
          </p>
        </div>

        <div className="space-y-28 md:space-y-36">
          {chapters.map((c, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={c.key}
                className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center"
              >
                <div
                  className={`md:col-span-7 ${
                    reverse ? "md:order-2" : ""
                  }`}
                >
                  <div className={`overflow-hidden ${c.ratio}`}>
                    <img
                      src={c.img}
                      alt={t(`heritage.${c.key}.title`)}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className={`md:col-span-5 ${reverse ? "md:order-1" : ""}`}>
                  <span className="font-serif italic text-gold text-sm">
                    {t(`heritage.${c.key}.chapter`)}
                  </span>
                  <h3 className="mt-2 font-serif italic text-4xl md:text-5xl text-wine leading-tight">
                    {t(`heritage.${c.key}.title`)}
                  </h3>
                  <p className="mt-6 font-light text-lg leading-relaxed text-walnut/80">
                    {t(`heritage.${c.key}.p1`)}
                  </p>
                  <p className="mt-4 font-light text-lg leading-relaxed text-walnut/80">
                    {t(`heritage.${c.key}.p2`)}
                  </p>
                  <p
                    className="mt-6 font-serif italic text-2xl text-wine border-l-2 border-gold pl-5"
                  >
                    “{t(`heritage.${c.key}.quote`)}”
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-walnut/10 border border-walnut/10">
          {facts.map((f, i) => (
            <div
              key={i}
              className="bg-cream px-6 py-10 text-center"
            >
              <div className="font-serif italic text-4xl md:text-5xl text-wine">
                {f.value}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-walnut/60">
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
