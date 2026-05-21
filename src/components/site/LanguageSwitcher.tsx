import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const langs = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "ka", label: "ქა" },
] as const;

export function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = current;
    }
  }, [current]);

  const base =
    tone === "light"
      ? "text-cream/70 hover:text-gold"
      : "text-walnut/60 hover:text-wine";
  const active = tone === "light" ? "text-gold" : "text-wine";

  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-medium">
      {langs.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => i18n.changeLanguage(l.code)}
            className={`transition-colors ${current === l.code ? active : base}`}
            aria-label={`Switch language to ${l.label}`}
          >
            {l.label}
          </button>
          {i < langs.length - 1 && <span className="opacity-30">·</span>}
        </span>
      ))}
    </div>
  );
}
