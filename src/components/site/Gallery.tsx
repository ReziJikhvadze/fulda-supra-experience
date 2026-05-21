import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import { Ornament } from "./Ornament";

const items = [
  { src: g1, alt: "Warm interior lighting and laid table", span: "row-span-2" },
  { src: g2, alt: "Guests toasting with Georgian wine", span: "" },
  { src: g4, alt: "Top down view of a Georgian feast", span: "" },
  { src: g3, alt: "Musician playing traditional Georgian instrument", span: "row-span-2" },
  { src: g5, alt: "Khachapuri being pulled from the stone oven", span: "" },
  { src: g6, alt: "Pouring amber Georgian wine into a crystal glass", span: "" },
];

export function Gallery() {
  return (
    <section className="py-24 md:py-32 bg-walnut text-cream">
      <div className="px-6 md:px-12 mb-16 text-center">
        <Ornament className="mb-8" />
        <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
          Atmosphere
        </span>
        <h2 className="mt-3 text-5xl md:text-6xl font-serif italic">An Evening with Us</h2>
      </div>

      <div className="px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[220px] gap-3">
          {items.map((it, i) => (
            <figure
              key={i}
              className={`relative overflow-hidden group ${it.span}`}
            >
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-walnut/20 group-hover:bg-walnut/0 transition-colors duration-700" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
