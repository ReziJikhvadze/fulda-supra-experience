import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Intro } from "@/components/site/Intro";
import { MenuSection } from "@/components/site/MenuSection";
import { WineCellar } from "@/components/site/WineCellar";
import { Story } from "@/components/site/Story";
import { Events } from "@/components/site/Events";
import { Reservation } from "@/components/site/Reservation";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TITLE } from "@/lib/brand";

const TITLE = BRAND_TITLE;
const DESCRIPTION = BRAND_DESCRIPTION;

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "Tabla Fulda, Georgian restaurant Fulda, Georgian cuisine Fulda, Khachapuri Fulda, Khinkali Fulda, Georgian wine Fulda" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: BRAND_NAME,
          servesCuisine: "Georgian",
          priceRange: "€€",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Am Stockhaus 10-12",
            postalCode: "36037",
            addressLocality: "Fulda",
            addressCountry: "DE",
          },
          telephone: "+4966183344399",
          openingHours: "Tu-Fr 16:00-23:00, Sa-Su 14:00-23:00",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="bg-cream text-walnut">
      <SiteNav />
      <main>
        <Hero />
        <Intro />
        <MenuSection />
        <WineCellar />
        <Story />
        <Events />
        <Reservation />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
