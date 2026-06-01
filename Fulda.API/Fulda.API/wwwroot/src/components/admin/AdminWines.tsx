import { useCallback, useEffect, useState } from "react";
import { apiDelete, apiPost, apiPut, apiUpload, winesApi, type WineCategoryDto, type WineDto } from "@/lib/api";
import { adminMutate } from "@/lib/adminMutate";
import { getToken } from "@/lib/auth";
import { Switch } from "@/components/ui/switch";

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

  const saveWine = async (wine: WineDto, draft: Partial<WineDto>) => {
    const token = getToken();
    if (!token) return;
    const ok = await adminMutate("Wine saved", () =>
      apiPut(`/api/wines/${wine.id}`, {
        name: draft.name ?? wine.name,
        description: draft.description ?? wine.description ?? "",
        price: draft.price ?? wine.price,
        country: draft.country ?? wine.country ?? "",
        year: draft.year ?? wine.year,
        imageUrl: draft.imageUrl ?? wine.imageUrl,
        isAvailable: draft.isAvailable ?? wine.isAvailable,
      }, token),
    );
    if (ok) void load();
  };

  const addWine = async (categoryId: number) => {
    const token = getToken();
    if (!token) return;
    const name = prompt("Wine name?");
    if (!name) return;
    const ok = await adminMutate("Wine added", () =>
      apiPost(
        "/api/wines",
        { categoryId, name, description: "", price: 9.5, country: "Georgia", isAvailable: true },
        token,
      ),
    );
    if (ok) void load();
  };

  const uploadImage = async (wine: WineDto) => {
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
      await saveWine(wine, { imageUrl: uploaded.data.url });
    };
    input.click();
  };

  const deleteWine = async (id: number) => {
    if (!confirm("Delete this wine?")) return;
    const token = getToken();
    if (!token) return;
    const ok = await adminMutate("Wine deleted", () => apiDelete(`/api/wines/${id}`, token));
    if (ok) void load();
  };

  if (loading) return <p>Loading wines…</p>;

  return (
    <div>
      <h1 className="font-serif italic text-3xl text-wine mb-6">Wines</h1>
      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.id} className="border border-walnut/10 p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-serif text-xl">{cat.name}</h2>
              <button type="button" onClick={() => void addWine(cat.id)} className="text-xs uppercase text-wine">
                Add wine
              </button>
            </div>
            <ul className="space-y-6">
              {cat.wines.map((wine) => (
                <WineEditor
                  key={wine.id}
                  wine={wine}
                  onSave={(d) => void saveWine(wine, d)}
                  onUpload={() => void uploadImage(wine)}
                  onDelete={() => void deleteWine(wine.id)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function WineEditor({
  wine,
  onSave,
  onUpload,
  onDelete,
}: {
  wine: WineDto;
  onSave: (draft: Partial<WineDto>) => void;
  onUpload: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(wine.name);
  const [description, setDescription] = useState(wine.description ?? "");
  const [price, setPrice] = useState(String(wine.price));
  const [country, setCountry] = useState(wine.country ?? "");
  const [year, setYear] = useState(wine.year ? String(wine.year) : "");
  const [available, setAvailable] = useState(wine.isAvailable);

  useEffect(() => {
    setName(wine.name);
    setDescription(wine.description ?? "");
    setPrice(String(wine.price));
    setCountry(wine.country ?? "");
    setYear(wine.year ? String(wine.year) : "");
    setAvailable(wine.isAvailable);
  }, [wine]);

  return (
    <li className="border border-walnut/10 p-4 space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-xs uppercase tracking-wider text-walnut/60">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border px-2 py-1.5 text-sm bg-white" />
        </label>
        <label className="block text-xs uppercase tracking-wider text-walnut/60">
          Price (€)
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 w-full border px-2 py-1.5 text-sm bg-white" />
        </label>
        <label className="block text-xs uppercase tracking-wider text-walnut/60">
          Country
          <input value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 w-full border px-2 py-1.5 text-sm bg-white" />
        </label>
        <label className="block text-xs uppercase tracking-wider text-walnut/60">
          Year
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 w-full border px-2 py-1.5 text-sm bg-white" />
        </label>
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full border px-2 py-1.5 text-sm bg-white" />
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={available} onCheckedChange={setAvailable} />
        Available
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onSave({
              name,
              description,
              price: parseFloat(price) || 0,
              country,
              year: year ? parseInt(year, 10) : undefined,
              isAvailable: available,
            })
          }
          className="px-3 py-1.5 bg-wine text-cream text-xs uppercase"
        >
          Save
        </button>
        <button type="button" onClick={onUpload} className="px-3 py-1.5 border text-xs uppercase">
          Upload image
        </button>
        <button type="button" onClick={onDelete} className="px-3 py-1.5 text-xs uppercase text-wine">
          Delete
        </button>
      </div>
    </li>
  );
}
