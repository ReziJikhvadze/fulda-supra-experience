import { Ornament } from "./Ornament";

export function Footer() {
  return (
    <footer className="bg-walnut text-cream pt-20 pb-10 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Ornament className="mb-8" />
          <p className="font-serif italic text-3xl md:text-4xl text-gold">
            Georgian hospitality in Fulda.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div>
            <div className="text-xl font-serif italic mb-4">Am Stockhaus</div>
            <p className="text-cream/60 font-light leading-relaxed">
              A hidden Georgian dining house in the heart of Fulda.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold mb-4">Visit</h4>
            <p className="text-cream/70 font-light leading-relaxed">
              Am Stockhaus 10–12<br />
              36037 Fulda<br />
              Germany
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold mb-4">Hours</h4>
            <p className="text-cream/70 font-light leading-relaxed">
              Tue — Sun<br />
              17:00 — 23:00
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold mb-4">Contact</h4>
            <p className="text-cream/70 font-light leading-relaxed">
              +49 (0) 661 123 4567<br />
              hello@am-stockhaus.de
            </p>
            <div className="mt-4 flex gap-4 text-cream/60">
              <a href="#" aria-label="Instagram" className="hover:text-gold">Instagram</a>
              <a href="#" aria-label="Facebook" className="hover:text-gold">Facebook</a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-cream/40">
          <span>© {new Date().getFullYear()} Am Stockhaus — Georgian Restaurant, Fulda</span>
          <span className="font-serif italic normal-case tracking-normal text-sm">
            Made with warmth.
          </span>
        </div>
      </div>
    </footer>
  );
}
