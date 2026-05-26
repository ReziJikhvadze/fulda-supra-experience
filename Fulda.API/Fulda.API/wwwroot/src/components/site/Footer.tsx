import { useTranslation } from "react-i18next";
import { Ornament } from "./Ornament";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-walnut text-cream pt-20 pb-10 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Ornament className="mb-8" />
          <p className="font-serif italic text-3xl md:text-4xl text-gold">
            {t("footer.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div>
            <div className="text-xl font-serif italic mb-4">Am Stockhaus</div>
            <p className="text-cream/60 font-light leading-relaxed">{t("footer.short")}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold mb-4">{t("footer.visit")}</h4>
            <p className="text-cream/70 font-light leading-relaxed whitespace-pre-line">
              {t("contact.addressLines")}
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold mb-4">{t("footer.hours")}</h4>
            <p className="text-cream/70 font-light leading-relaxed">{t("contact.hoursLine")}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold mb-4">{t("footer.contact")}</h4>
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
          <span>© {new Date().getFullYear()} Am Stockhaus — {t("footer.rights")}</span>
          <div className="flex items-center gap-6">
            <LanguageSwitcher tone="light" />
            <span className="font-serif italic normal-case tracking-normal text-sm">
              {t("footer.madeWith")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
