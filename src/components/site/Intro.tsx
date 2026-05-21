import introImg from "@/assets/intro-khinkali.jpg";

export function Intro() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-cream text-walnut">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        <div className="md:col-span-7 relative">
          <img
            src={introImg}
            alt="Hands folding traditional Georgian khinkali dumplings"
            loading="lazy"
            width={1000}
            height={1280}
            className="w-full aspect-[4/5] object-cover rounded-sm"
          />
          <div className="absolute -bottom-6 -right-6 hidden md:block bg-wine text-cream px-8 py-6">
            <p className="font-serif italic text-2xl leading-tight">Supra</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cream/70 mt-1">
              The Georgian feast
            </p>
          </div>
        </div>
        <div className="md:col-span-5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
            Our Philosophy
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif italic text-wine leading-tight">
            Food is more than a meal — it is a celebration.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-walnut/80 font-light">
            In Georgia, the table is sacred. We bring the tradition of the
            Georgian <em>Supra</em> to Fulda with handmade dishes and flavors
            that carry the soul of the Caucasus.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-walnut/80 font-light">
            In our house, the guest is a gift from God. Every khachapuri from
            the oven and every bottle of Saperavi opened is a testament to
            our hospitality.
          </p>
          <div className="h-px w-20 bg-gold mt-10 origin-left" style={{ animation: "var(--animate-draw)" }} />
          <p className="mt-4 text-xs uppercase tracking-[0.25em] font-bold text-wine">
            Am Stockhaus 10–12 · Fulda
          </p>
        </div>
      </div>
    </section>
  );
}
