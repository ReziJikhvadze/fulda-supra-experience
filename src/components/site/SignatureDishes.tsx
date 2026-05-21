import khachapuri from "@/assets/dish-khachapuri.jpg";
import khinkali from "@/assets/dish-khinkali.jpg";
import mtsvadi from "@/assets/dish-mtsvadi.jpg";
import lobio from "@/assets/dish-lobio.jpg";
import pkhali from "@/assets/dish-pkhali.jpg";
import badrijani from "@/assets/dish-badrijani.jpg";
import salad from "@/assets/dish-salad.jpg";
import churchkhela from "@/assets/dish-churchkhela.jpg";
import { useTranslation } from "react-i18next";
import { Ornament } from "./Ornament";

const dishes = [
  { key: "khachapuri", img: khachapuri, price: "14.50" },
  { key: "khinkali", img: khinkali, price: "16.00" },
  { key: "mtsvadi", img: mtsvadi, price: "22.00" },
  { key: "lobio", img: lobio, price: "13.50" },
  { key: "pkhali", img: pkhali, price: "11.50" },
  { key: "badrijani", img: badrijani, price: "12.50" },
  { key: "salad", img: salad, price: "10.00" },
  { key: "churchkhela", img: churchkhela, price: "6.50" },
];

export function SignatureDishes() {
  const { t } = useTranslation();
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
        {dishes.map((d) => {
          const name = t(`dishes.${d.key}.name`);
          return (
            <article
              key={d.key}
              className="group relative bg-walnut p-8 transition-colors duration-500 hover:bg-wine/30"
            >
              <div className="overflow-hidden aspect-square mb-6">
                <img
                  src={d.img}
                  alt={name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms]"
                />
              </div>
              <div className="flex justify-between items-baseline mb-2 gap-4">
                <h3 className="text-2xl font-serif">{name}</h3>
                <span className="text-gold font-light text-lg">€{d.price}</span>
              </div>
              <p className="text-sm leading-relaxed text-cream/60 font-light">
                {t(`dishes.${d.key}.desc`)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
