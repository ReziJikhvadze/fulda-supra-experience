import { useCallback, useEffect, useState } from "react";
import { apiDelete, apiPost, apiPut, apiUpload, winesApi, type WineCategoryDto } from "@/lib/api";
import { getToken } from "@/lib/auth";

export function AdminWines() {
  const [categories, setCategories] = useState<WineCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    const result = await winesApi.admin(token);
    if (result.success && result.data) setCategories(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addWine = async (categoryId: number) => {
    const token = getToken();
    if (!token) return;
    const name = prompt("Wine name?");
    if (!name) return;
    const priceStr = prompt("Price (EUR)?", "9.50");
    if (!priceStr) return;
    await apiPost(
      "/api/wines",
      {
        categoryId,
        name,
        description: "",
        price: parseFloat(priceStr),
        country: "Georgia",
        isAvailable: true,
      },
      token,
    );
    void load();
  };

  const toggleWine = async (wine: WineCategoryDto["wines"][number]) => {
    const token = getToken();
    if (!token) return;
    await apiPut(
      `/api/wines/${wine.id}`,
      {
        name: wine.name,
        description: wine.description,
        price: wine.price,
        country: wine.country,
        year: wine.year,
        imageUrl: wine.imageUrl,
        isAvailable: !wine.isAvailable,
      },
      token,
    );
    void load();
  };

  const uploadImage = async (wine: WineCategoryDto["wines"][number]) => {
    const token = getToken();
    if (!token) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const uploaded = await apiUpload("/api/images/upload", file, token);
      if (!uploaded.success || !uploaded.data) return;
      await apiPut(
        `/api/wines/${wine.id}`,
        {
          name: wine.name,
          description: wine.description,
          price: wine.price,
          country: wine.country,
          year: wine.year,
          imageUrl: uploaded.data.url,
          isAvailable: wine.isAvailable,
        },
        token,
      );
      void load();
    };
    input.click();
  };

  const deleteWine = async (id: number) => {
    if (!confirm("Delete this wine?")) return;
    const token = getToken();
    if (!token) return;
    await apiDelete(`/api/wines/${id}`, token);
    void load();
  };

  if (loading) return <p>Loading wines…</p>;

  return (
    <div>
      <h1 className="font-serif italic text-3xl text-wine mb-6">Wines</h1>
      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.id} className="border border-walnut/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">{cat.name}</h2>
              <button onClick={() => void addWine(cat.id)} className="text-xs uppercase tracking-wider text-wine hover:underline">
                Add wine
              </button>
            </div>
            <ul className="space-y-3">
              {cat.wines.map((wine) => (
                <li key={wine.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-walnut/10 pb-3">
                  <div>
                    <span className="font-medium">{wine.name}</span>
                    <span className="ml-3 text-gold">€{wine.price.toFixed(2)}</span>
                    {wine.country && <span className="ml-2 text-xs text-walnut/60">{wine.country}</span>}
                    {!wine.isAvailable && <span className="ml-2 text-xs text-wine">Unavailable</span>}
                  </div>
                  <div className="space-x-3 text-xs">
                    <button onClick={() => void toggleWine(wine)} className="hover:underline">
                      Toggle availability
                    </button>
                    <button onClick={() => void uploadImage(wine)} className="hover:underline">
                      Upload image
                    </button>
                    <button onClick={() => void deleteWine(wine.id)} className="text-wine hover:underline">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
