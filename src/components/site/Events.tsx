import { Ornament } from "./Ornament";

const events = [
  {
    title: "Georgian Wine Tasting",
    desc: "A guided journey through Saperavi, Rkatsiteli and the qvevri tradition. Paired with small Georgian plates.",
  },
  {
    title: "Supra Family Nights",
    desc: "Long-table, family-style feasts in the Georgian tradition. Toasts, music, and an endless flow of dishes.",
  },
  {
    title: "Live Music Evenings",
    desc: "Traditional Georgian polyphony and panduri performed live in our intimate dining room.",
  },
  {
    title: "Private Celebrations",
    desc: "Birthdays, anniversaries and corporate dinners — bespoke menus and a private wing of the restaurant.",
  },
];

export function Events() {
  return (
    <section id="events" className="py-24 md:py-32 bg-cream text-walnut">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-16">
          <Ornament className="mb-8" />
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
            Cultural Evenings
          </span>
          <h2 className="mt-3 text-5xl md:text-6xl font-serif italic text-wine">
            Georgian Evenings in Fulda
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-walnut/70 font-light text-lg leading-relaxed">
            From wine tastings to family-style supra nights, our restaurant is
            a place for stories, music, celebration, and unforgettable tables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-walnut/10">
          {events.map((e, i) => (
            <article
              key={e.title}
              className="bg-cream p-10 md:p-14 hover:bg-wine hover:text-cream transition-colors duration-500 group"
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-serif italic text-gold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-walnut/40 group-hover:text-cream/60">
                  Reservation required
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
