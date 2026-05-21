import wineImg from "@/assets/wine-cellar.jpg";
import { Ornament } from "./Ornament";

const wines = [
  { name: "Saperavi Qvevri", region: "Kakheti", note: "Bold, dark cherry, mountain smoke." },
  { name: "Rkatsiteli Amber", region: "Kakheti", note: "Legendary orange wine — complex, floral." },
  { name: "Mukuzani Reserve", region: "Kakheti", note: "Aged Saperavi, deep and structured." },
  { name: "Kindzmarauli", region: "Alazani Valley", note: "Semi-sweet red, plum and blackberry." },
];

export function WineCellar() {
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
            Ancient Traditions
          </span>
          <h2 className="mt-4 text-5xl md:text-7xl font-serif italic">
            Discover the Birthplace of Wine
          </h2>
          <p className="mt-8 max-w-2xl mx-auto text-cream/80 font-light text-lg leading-relaxed">
            Georgia is one of the oldest wine cultures in the world. For 8,000
            years, qvevri have been buried in the earth to age what we pour
            tonight. Our cellar brings the depth, warmth and character of
            Georgian winemaking to Fulda.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-px bg-cream/10">
          {wines.map((w) => (
            <div key={w.name} className="bg-wine p-8 hover:bg-walnut/40 transition-colors">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl">{w.name}</h3>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                  {w.region}
                </span>
              </div>
              <p className="mt-3 text-cream/70 font-light text-sm leading-relaxed">{w.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="#reserve"
            className="inline-block px-12 py-4 border border-gold text-gold text-[11px] uppercase tracking-[0.25em] hover:bg-gold hover:text-wine transition-colors"
          >
            Reserve a wine tasting
          </a>
        </div>
      </div>
    </section>
  );
}
