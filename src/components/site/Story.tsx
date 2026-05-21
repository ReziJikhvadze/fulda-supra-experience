import storyImg from "@/assets/story-interior.jpg";
import { Ornament } from "./Ornament";

export function Story() {
  return (
    <section id="story" className="py-24 md:py-32 bg-cream text-walnut">
      <div className="mx-auto max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
        <div className="md:col-span-5 order-2 md:order-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
            Our Story
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif italic text-wine leading-tight">
            A Georgian table, set in Fulda.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-walnut/80 font-light">
            We opened our Georgian table in Fulda to share the food we grew up
            with — dishes made for sharing, wine poured with generosity, and
            hospitality that makes every guest feel like family.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-walnut/80 font-light">
            From the clay ovens of Tbilisi to the wine cellars of Kakheti, every
            recipe is carried by hand. We cook the way our grandmothers cooked
            — slowly, with intention, and always with one more chair at the
            table.
          </p>
          <Ornament className="mt-10 justify-start" />
        </div>
        <div className="md:col-span-7 order-1 md:order-2 relative">
          <img
            src={storyImg}
            alt="The dining room at Am Stockhaus Georgian Restaurant in Fulda"
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
