import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Intro } from "@/components/site/Intro";
import { SignatureDishes } from "@/components/site/SignatureDishes";
import { MenuSection } from "@/components/site/MenuSection";
import { WineCellar } from "@/components/site/WineCellar";
import { Heritage } from "@/components/site/Heritage";
import { Story } from "@/components/site/Story";
import { Gallery } from "@/components/site/Gallery";
import { Events } from "@/components/site/Events";
import { Reservation } from "@/components/site/Reservation";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

const TITLE = "Am Stockhaus — Georgian Restaurant in Fulda";
const DESCRIPTION =
  "Authentic Georgian cuisine in Fulda. Handmade khachapuri, khinkali, mtsvadi and Georgian wine at Am Stockhaus 10–12, 36037 Fulda.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "Georgian restaurant Fulda, Georgian cuisine Fulda, Khachapuri Fulda, Khinkali Fulda, Georgian wine Fulda, Restaurant Am Stockhaus Fulda" },
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
          name: "Am Stockhaus — Georgian Restaurant",
          servesCuisine: "Georgian",
          priceRange: "€€",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Am Stockhaus 10-12",
            postalCode: "36037",
            addressLocality: "Fulda",
            addressCountry: "DE",
          },
          telephone: "+49 661 1234567",
          openingHours: "Tu-Su 17:00-23:00",
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
        <SignatureDishes />
        <MenuSection />
        <WineCellar />
        <Heritage />
        <Story />
        <Gallery />
        <Events />
        <Reservation />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
