import { useCallback, useEffect, useState } from "react";
import { apiPut, siteImagesApi } from "@/lib/api";
import { adminMutate } from "@/lib/adminMutate";
import { getToken } from "@/lib/auth";
import { clearSiteImagesCache } from "@/lib/siteImages";

type Slot = {
  key: "intro" | "story";
  title: string;
  hint: string;
};

const slots: Slot[] = [
  {
    key: "intro",
    title: "Intro — khinkali image",
    hint: "Large photo on the cream section (hands folding khinkali).",
  },
  {
    key: "story",
    title: "Story — dining room image",
    hint: 'Photo with alt text "The dining room at Tabla Georgian restaurant in Fulda".',
  },
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export function AdminSiteImages() {
  const [intro, setIntro] = useState<string | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await siteImagesApi.public();
    if (result.success && result.data) {
      setIntro(result.data.intro ?? null);
      setStory(result.data.story ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (key: "intro" | "story", imageData: string | null) => {
    const token = getToken();
    if (!token) return;
    const ok = await adminMutate("Image saved", () =>
      apiPut(`/api/site-images/${key}`, { imageData }, token),
    );
    if (ok) {
      clearSiteImagesCache();
      void load();
    }
  };

  const upload = async (key: "intro" | "story", file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5 MB.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    await save(key, dataUrl);
  };

  const values = { intro, story } as const;

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="font-serif italic text-3xl text-wine mb-2">Homepage images</h1>
      <p className="mb-8 text-sm text-walnut/70 max-w-2xl">
        Images are stored in the database as base64 — no Azure Blob needed. JPG, PNG or WEBP, max 5 MB.
        Leave empty and use <strong>Reset to default</strong> to show the built-in photos again.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {slots.map((slot) => (
          <section key={slot.key} className="border border-walnut/10 p-6 space-y-4">
            <div>
              <h2 className="font-serif text-xl text-wine">{slot.title}</h2>
              <p className="text-sm text-walnut/65 mt-1">{slot.hint}</p>
            </div>

            {values[slot.key] ? (
              <img
                src={values[slot.key]!}
                alt=""
                className="w-full max-h-72 object-cover border border-walnut/15"
              />
            ) : (
              <p className="text-sm text-walnut/50 italic">Using default bundled image.</p>
            )}

            <div className="flex flex-wrap gap-2">
              <label className="px-3 py-1.5 bg-wine text-cream text-xs uppercase tracking-wider cursor-pointer">
                Upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void upload(slot.key, file);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => void save(slot.key, null)}
                className="px-3 py-1.5 border border-walnut/30 text-xs uppercase"
              >
                Reset to default
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
