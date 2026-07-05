import { useEffect, useState } from "react";
import { siteImagesApi } from "@/lib/api";

type SiteImageKey = "intro" | "story";

let cached: Partial<Record<SiteImageKey, string | null>> | null = null;
let loadPromise: Promise<void> | null = null;

async function ensureSiteImagesLoaded() {
  if (cached) return;
  if (!loadPromise) {
    loadPromise = siteImagesApi.public().then((result) => {
      if (result.success && result.data) {
        cached = { intro: result.data.intro ?? null, story: result.data.story ?? null };
      } else {
        cached = { intro: null, story: null };
      }
    });
  }
  await loadPromise;
}

/** Returns a dynamic base64 URL from the DB when set, otherwise the bundled fallback. */
export function useSiteImage(key: SiteImageKey, fallback: string): string {
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    void ensureSiteImagesLoaded().then(() => {
      if (cancelled) return;
      const dynamic = cached?.[key];
      if (dynamic) setSrc(dynamic);
    });
    return () => {
      cancelled = true;
    };
  }, [key, fallback]);

  return src;
}

/** Call after admin saves so the public site picks up new images without reload. */
export function clearSiteImagesCache() {
  cached = null;
  loadPromise = null;
}
