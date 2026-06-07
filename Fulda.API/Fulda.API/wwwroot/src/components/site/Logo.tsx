/** Stable URL — same path on every deploy (no Vite hash). File: public/logo.png */
const LOGO_SRC = "/logo.png";

type LogoProps = {
  className?: string;
  /** Nav: shorter on mobile. Footer: slightly larger. */
  variant?: "nav" | "footer" | "admin";
};

const heights: Record<NonNullable<LogoProps["variant"]>, string> = {
  nav: "h-20 md:h-24 w-auto",
  footer: "h-28 md:h-32 w-auto",
  admin: "h-[4.5rem] w-auto",
};

export function Logo({ className = "", variant = "nav" }: LogoProps) {
  return (
    <img
      src={LOGO_SRC}
      alt="Tabla — Georgische Küche & Wein"
      className={`object-contain object-left ${heights[variant]} ${className}`}
      width={480}
      height={160}
    />
  );
}

/** Use on cream/light pages so the logo still looks correct. */
export function LogoOnDarkPanel({
  className = "",
  variant = "admin",
}: LogoProps) {
  return (
    <div className={`inline-block rounded-md bg-walnut px-4 py-2 ${className}`}>
      <Logo variant={variant} />
    </div>
  );
}
