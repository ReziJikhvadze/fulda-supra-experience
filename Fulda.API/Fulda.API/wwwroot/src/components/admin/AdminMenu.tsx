import { useCallback, useEffect, useState } from "react";
import { apiDelete, apiPost, apiPut, apiUpload, menuApi, type MenuCategoryDto, type MenuItemDto } from "@/lib/api";
import { adminMutate } from "@/lib/adminMutate";
import { getToken } from "@/lib/auth";
import { Switch } from "@/components/ui/switch";

export function AdminMenu() {
  const [categories, setCategories] = useState<MenuCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    const result = await menuApi.admin(token);
    if (result.success && result.data) setCategories(result.data);
    else if (!result.success) setCategories([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveItem = async (item: MenuItemDto, draft: Partial<MenuItemDto>) => {
    const token = getToken();
    if (!token) return;
    const ok = await adminMutate("Menu item saved", () =>
      apiPut(`/api/menu/items/${item.id}`, {
        name: draft.name ?? item.name,
        description: draft.description ?? item.description ?? "",
        price: draft.price ?? item.price,
        imageUrl: draft.imageUrl ?? item.imageUrl,
        isAvailable: draft.isAvailable ?? item.isAvailable,
        displayOrder: draft.displayOrder ?? item.displayOrder,
      }, token),
    );
    if (ok) void load();
  };

  const addCategory = async () => {
    const token = getToken();
    if (!token) return;
    const name = prompt("Category name?");
    if (!name) return;
    const ok = await adminMutate("Category added", () =>
      apiPost("/api/menu/categories", { name, displayOrder: categories.length + 1, isActive: true }, token),
    );
    if (ok) void load();
  };

  const addItem = async (categoryId: number) => {
    const token = getToken();
    if (!token) return;
    const name = prompt("Item name?");
    if (!name) return;
    const ok = await adminMutate("Item added", () =>
      apiPost(
        "/api/menu/items",
        {
          categoryId,
          name,
          description: "",
          price: 12,
          isAvailable: true,
          displayOrder: 0,
        },
        token,
      ),
    );
    if (ok) void load();
  };

  const uploadImage = async (item: MenuItemDto) => {
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
      await saveItem(item, { imageUrl: uploaded.data.url });
    };
    input.click();
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Delete this menu item?")) return;
    const token = getToken();
    if (!token) return;
    const ok = await adminMutate("Item deleted", () => apiDelete(`/api/menu/items/${id}`, token));
    if (ok) void load();
  };

  if (loading) return <p>Loading menu…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif italic text-3xl text-wine">Menu</h1>
        <button
          type="button"
          onClick={() => void addCategory()}
          className="px-4 py-2 bg-gold text-walnut text-xs uppercase tracking-wider"
        >
          Add category
        </button>
      </div>

      <p className="mb-6 text-sm text-walnut/70 max-w-2xl">
        Homepage <strong>Signature Plates</strong> uses the <strong>Signature Plates</strong> category below
        (name, price, description, and uploaded image). Uploads go to Azure Blob when configured, otherwise
        to the API <code className="text-xs">uploads/</code> folder.
      </p>

      <div className="space-y-8">
        {categories.map((cat) => {
          const isSignature = cat.name.toLowerCase() === "signature plates";
          return (
          <section
            key={cat.id}
            className={`border p-6 ${isSignature ? "border-gold/50 bg-gold/5" : "border-walnut/10"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">
                {cat.name}
                {isSignature && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider text-gold font-sans not-italic">
                    → homepage section
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => void addItem(cat.id)}
                className="text-xs uppercase tracking-wider text-wine hover:underline"
              >
                Add item
              </button>
            </div>
            <ul className="space-y-6">
              {cat.items.map((item) => (
                <MenuItemEditor
                  key={item.id}
                  item={item}
                  onSave={(draft) => void saveItem(item, draft)}
                  onUpload={() => void uploadImage(item)}
                  onDelete={() => void deleteItem(item.id)}
                />
              ))}
            </ul>
          </section>
        );
        })}
      </div>
    </div>
  );
}

function MenuItemEditor({
  item,
  onSave,
  onUpload,
  onDelete,
}: {
  item: MenuItemDto;
  onSave: (draft: Partial<MenuItemDto>) => void;
  onUpload: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(String(item.price));
  const [available, setAvailable] = useState(item.isAvailable);

  useEffect(() => {
    setName(item.name);
    setDescription(item.description ?? "");
    setPrice(String(item.price));
    setAvailable(item.isAvailable);
  }, [item]);

  return (
    <li className="border border-walnut/10 p-4 space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-xs uppercase tracking-wider text-walnut/60">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-walnut/20 px-2 py-1.5 text-sm bg-white"
          />
        </label>
        <label className="block text-xs uppercase tracking-wider text-walnut/60">
          Price (€)
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full border border-walnut/20 px-2 py-1.5 text-sm bg-white"
          />
        </label>
      </div>
      <label className="block text-xs uppercase tracking-wider text-walnut/60">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 w-full border border-walnut/20 px-2 py-1.5 text-sm bg-white"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={available} onCheckedChange={setAvailable} />
          Available
        </label>
        {item.imageUrl && (
          <>
            <img
              src={item.imageUrl}
              alt=""
              className="h-14 w-14 object-cover border border-walnut/20"
            />
            <a href={item.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-wine underline">
              View full image
            </a>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onSave({
              name,
              description,
              price: parseFloat(price) || 0,
              isAvailable: available,
            })
          }
          className="px-3 py-1.5 bg-wine text-cream text-xs uppercase tracking-wider"
        >
          Save
        </button>
        <button type="button" onClick={onUpload} className="px-3 py-1.5 border border-walnut/30 text-xs uppercase">
          Upload image
        </button>
        <button type="button" onClick={onDelete} className="px-3 py-1.5 text-xs uppercase text-wine">
          Delete
        </button>
      </div>
    </li>
  );
}
