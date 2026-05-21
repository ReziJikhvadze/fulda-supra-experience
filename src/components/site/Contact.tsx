import { Ornament } from "./Ornament";

const ADDRESS_QUERY = encodeURIComponent("Am Stockhaus 10-12, 36037 Fulda, Germany");

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-cream text-walnut">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-16">
          <Ornament className="mb-8" />
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
            Find Us
          </span>
          <h2 className="mt-3 text-5xl md:text-6xl font-serif italic text-wine">
            Am Stockhaus 10–12
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <div className="aspect-[4/3] w-full overflow-hidden border border-walnut/10">
              <iframe
                title="Map to Am Stockhaus 10-12, 36037 Fulda"
                src={`https://www.google.com/maps?q=${ADDRESS_QUERY}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale-[0.4] contrast-[0.95]"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-10">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3">
                Address
              </h3>
              <p className="font-serif text-2xl leading-snug text-walnut">
                Am Stockhaus 10–12
                <br />
                36037 Fulda, Germany
              </p>
              <a
                href={`https://www.google.com/maps?q=${ADDRESS_QUERY}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm uppercase tracking-[0.2em] text-wine border-b border-wine pb-1 hover:text-gold hover:border-gold transition-colors"
              >
                Get Directions
              </a>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3">
                Hours
              </h3>
              <p className="text-lg font-light">Tue — Sun · 17:00 — 23:00</p>
              <p className="text-sm font-light italic opacity-60">Monday closed</p>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3">
                Contact
              </h3>
              <p className="text-lg font-light">+49 (0) 661 123 4567</p>
              <p className="text-lg font-light">hello@am-stockhaus.de</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
