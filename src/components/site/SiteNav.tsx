import { useEffect, useState } from "react";

const links = [
  { href: "#menu", label: "The Kitchen" },
  { href: "#wine", label: "Wine Cellar" },
  { href: "#story", label: "Our Story" },
  { href: "#events", label: "Events" },
  { href: "#reserve", label: "Reservations" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-walnut/90 backdrop-blur-md border-b border-cream/10 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 text-cream">
        <a href="#top" className="text-2xl font-serif italic tracking-tight">
          Am&nbsp;Stockhaus
        </a>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.22em] font-medium">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gold transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#reserve"
          className="hidden md:inline-block px-5 py-2 border border-cream/30 text-[11px] uppercase tracking-[0.2em] hover:bg-cream hover:text-walnut transition-all"
        >
          Book Table
        </a>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-cream"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-walnut/95 backdrop-blur-md text-cream px-6 py-6 border-t border-cream/10">
          <div className="flex flex-col gap-4 text-sm uppercase tracking-[0.2em]">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-gold">
                {l.label}
              </a>
            ))}
            <a
              href="#reserve"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block px-5 py-3 border border-cream/30 text-center text-xs"
            >
              Book Table
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
