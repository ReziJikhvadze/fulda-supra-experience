import { useCallback, useEffect, useState } from "react";
import { apiDelete, apiPost, apiPut, apiUpload, menuApi, type MenuCategoryDto } from "@/lib/api";
import { getToken } from "@/lib/auth";

export function AdminMenu() {
  const [categories, setCategories] = useState<MenuCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    const result = await menuApi.admin(token);
    if (result.success && result.data) setCategories(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addCategory = async () => {
    const token = getToken();
    if (!token) return;
    const name = prompt("Category name?");
    if (!name) return;
    await apiPost("/api/menu/categories", { name, displayOrder: categories.length + 1, isActive: true }, token);
    void load();
  };

  const addItem = async (categoryId: number) => {
    const token = getToken();
    if (!token) return;
    const name = prompt("Item name?");
    if (!name) return;
    const priceStr = prompt("Price (EUR)?", "12.00");
    if (!priceStr) return;
    await apiPost(
      "/api/menu/items",
      {
        categoryId,
        name,
        description: "",
        price: parseFloat(priceStr),
        isAvailable: true,
        displayOrder: 0,
      },
      token,
    );
    void load();
  };

  const toggleItem = async (id: number, isAvailable: boolean) => {
    const token = getToken();
    if (!token) return;
    const cat = categories.find((c) => c.items.some((i) => i.id === id));
    const item = cat?.items.find((i) => i.id === id);
    if (!item) return;
    await apiPut(
      `/api/menu/items/${id}`,
      {
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isAvailable: !isAvailable,
        displayOrder: item.displayOrder,
      },
      token,
    );
    void load();
  };

  const uploadImage = async (itemId: number) => {
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
      const cat = categories.find((c) => c.items.some((i) => i.id === itemId));
      const item = cat?.items.find((i) => i.id === itemId);
      if (!item) return;
      await apiPut(
        `/api/menu/items/${itemId}`,
        {
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: uploaded.data.url,
          isAvailable: item.isAvailable,
          displayOrder: item.displayOrder,
        },
        token,
      );
      void load();
    };
    input.click();
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Delete this menu item?")) return;
    const token = getToken();
    if (!token) return;
    await apiDelete(`/api/menu/items/${id}`, token);
    void load();
  };

  if (loading) return <p>Loading menu…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif italic text-3xl text-wine">Menu</h1>
        <button onClick={() => void addCategory()} className="px-4 py-2 bg-gold text-walnut text-xs uppercase tracking-wider">
          Add category
        </button>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.id} className="border border-walnut/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">{cat.name}</h2>
              <button onClick={() => void addItem(cat.id)} className="text-xs uppercase tracking-wider text-wine hover:underline">
                Add item
              </button>
            </div>
            <ul className="space-y-3">
              {cat.items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-walnut/10 pb-3">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-3 text-gold">€{item.price.toFixed(2)}</span>
                    {!item.isAvailable && <span className="ml-2 text-xs text-wine">Unavailable</span>}
                  </div>
                  <div className="space-x-3 text-xs">
                    <button onClick={() => void toggleItem(item.id, item.isAvailable)} className="hover:underline">
                      Toggle availability
                    </button>
                    <button onClick={() => void uploadImage(item.id)} className="hover:underline">
                      Upload image
                    </button>
                    <button onClick={() => void deleteItem(item.id)} className="text-wine hover:underline">
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
