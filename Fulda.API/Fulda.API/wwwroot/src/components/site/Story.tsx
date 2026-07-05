import storyImg from "@/assets/story-interior.jpg";
import { useTranslation } from "react-i18next";
import { Ornament } from "./Ornament";
import { useSiteImage } from "@/lib/siteImages";

export function Story() {
  const { t } = useTranslation();
  const imageSrc = useSiteImage("story", storyImg);
  return (
    <section id="story" className="py-24 md:py-32 bg-cream text-walnut">
      <div className="mx-auto max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
        <div className="md:col-span-5 order-2 md:order-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
            {t("story.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif italic text-wine leading-tight">
            {t("story.title")}
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-walnut/80 font-light">{t("story.p1")}</p>
          <p className="mt-4 text-lg leading-relaxed text-walnut/80 font-light">{t("story.p2")}</p>
          <Ornament className="mt-10 justify-start" />
        </div>
        <div className="md:col-span-7 order-1 md:order-2 relative">
          <img
            src={imageSrc}
            alt="The dining room at Tabla Georgian restaurant in Fulda"
            loading="lazy"
            width={1200}
            height={1500}
            className="w-full aspect-[4/5] md:aspect-[4/4.6] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
