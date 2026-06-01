import logo from "@/assets/logo.svg";

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

/** JPEG-in-SVG has a black matte; screen blend hides black on dark UI. */
const blendOnDark = "mix-blend-screen";

export function Logo({ className = "", variant = "nav" }: LogoProps) {
  return (
    <img
      src={logo}
      alt="Tabla — Georgische Küche & Wein"
      className={`object-contain object-left ${blendOnDark} ${heights[variant]} ${className}`}
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
