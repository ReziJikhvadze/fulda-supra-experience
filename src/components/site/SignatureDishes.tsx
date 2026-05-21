import khachapuri from "@/assets/dish-khachapuri.jpg";
import khinkali from "@/assets/dish-khinkali.jpg";
import mtsvadi from "@/assets/dish-mtsvadi.jpg";
import lobio from "@/assets/dish-lobio.jpg";
import pkhali from "@/assets/dish-pkhali.jpg";
import badrijani from "@/assets/dish-badrijani.jpg";
import salad from "@/assets/dish-salad.jpg";
import churchkhela from "@/assets/dish-churchkhela.jpg";
import { Ornament } from "./Ornament";

const dishes = [
  { img: khachapuri, name: "Khachapuri", price: "14.50", desc: "Golden Georgian cheese bread, baked warm and served fresh." },
  { img: khinkali, name: "Khinkali", price: "16.00", desc: "Handmade Georgian dumplings filled with rich, juicy flavor." },
  { img: mtsvadi, name: "Mtsvadi", price: "22.00", desc: "Traditional Georgian grilled meat, smoky and deeply satisfying." },
  { img: lobio, name: "Lobio", price: "13.50", desc: "Slow-cooked beans with herbs, spices and rustic comfort." },
  { img: pkhali, name: "Pkhali", price: "11.50", desc: "Colorful vegetable and walnut appetizers with delicate seasoning." },
  { img: badrijani, name: "Badrijani", price: "12.50", desc: "Eggplant rolls with walnut paste, herbs and pomegranate." },
  { img: salad, name: "Georgian Salad", price: "10.00", desc: "Fresh vegetables, herbs and walnut dressing." },
  { img: churchkhela, name: "Churchkhela", price: "6.50", desc: "Walnuts dipped in concentrated grape must — Georgian sweetness." },
];

export function SignatureDishes() {
  return (
    <section className="py-24 md:py-32 bg-walnut text-cream">
      <div className="px-6 md:px-12 mb-16 text-center">
        <Ornament className="mb-8" />
        <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
          Hand-crafted for the table
        </span>
        <h2 className="mt-3 text-5xl md:text-6xl font-serif italic">Signature Plates</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10">
        {dishes.map((d) => (
          <article
            key={d.name}
            className="group relative bg-walnut p-8 transition-colors duration-500 hover:bg-wine/30"
          >
            <div className="overflow-hidden aspect-square mb-6">
              <img
                src={d.img}
                alt={d.name}
                loading="lazy"
                width={800}
                height={800}
                className="h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms]"
              />
            </div>
            <div className="flex justify-between items-baseline mb-2 gap-4">
              <h3 className="text-2xl font-serif">{d.name}</h3>
              <span className="text-gold font-light text-lg">€{d.price}</span>
            </div>
            <p className="text-sm leading-relaxed text-cream/60 font-light">{d.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
