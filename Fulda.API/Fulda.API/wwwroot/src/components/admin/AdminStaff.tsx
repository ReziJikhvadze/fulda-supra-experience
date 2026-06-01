import { useCallback, useEffect, useState } from "react";
import { apiDelete, apiPost, apiPut, apiUpload, staffApi, type StaffMemberDto } from "@/lib/api";
import { adminMutate } from "@/lib/adminMutate";
import { getToken } from "@/lib/auth";
import { Switch } from "@/components/ui/switch";

export function AdminStaff() {
  const [members, setMembers] = useState<StaffMemberDto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    const result = await staffApi.admin(token);
    if (result.success && result.data) setMembers(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveMember = async (member: StaffMemberDto, draft: Partial<StaffMemberDto>) => {
    const token = getToken();
    if (!token) return;
    const ok = await adminMutate("Staff member saved", () =>
      apiPut(`/api/staff/${member.id}`, {
        fullName: draft.fullName ?? member.fullName,
        position: draft.position ?? member.position,
        bio: draft.bio ?? member.bio ?? "",
        imageUrl: draft.imageUrl ?? member.imageUrl,
        displayOrder: draft.displayOrder ?? member.displayOrder,
        isActive: draft.isActive ?? member.isActive,
      }, token),
    );
    if (ok) void load();
  };

  const addMember = async () => {
    const token = getToken();
    if (!token) return;
    const fullName = prompt("Full name?");
    if (!fullName) return;
    const ok = await adminMutate("Staff added", () =>
      apiPost(
        "/api/staff",
        { fullName, position: "Chef", bio: "", displayOrder: members.length + 1, isActive: true },
        token,
      ),
    );
    if (ok) void load();
  };

  const uploadImage = async (member: StaffMemberDto) => {
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
      await saveMember(member, { imageUrl: uploaded.data.url });
    };
    input.click();
  };

  const deleteMember = async (id: number) => {
    if (!confirm("Delete this staff member?")) return;
    const token = getToken();
    if (!token) return;
    const ok = await adminMutate("Staff deleted", () => apiDelete(`/api/staff/${id}`, token));
    if (ok) void load();
  };

  if (loading) return <p>Loading staff…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif italic text-3xl text-wine">Staff</h1>
        <button type="button" onClick={() => void addMember()} className="px-4 py-2 bg-gold text-walnut text-xs uppercase">
          Add staff member
        </button>
      </div>
      <ul className="space-y-6">
        {members.map((m) => (
          <StaffEditor
            key={m.id}
            member={m}
            onSave={(d) => void saveMember(m, d)}
            onUpload={() => void uploadImage(m)}
            onDelete={() => void deleteMember(m.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function StaffEditor({
  member,
  onSave,
  onUpload,
  onDelete,
}: {
  member: StaffMemberDto;
  onSave: (draft: Partial<StaffMemberDto>) => void;
  onUpload: () => void;
  onDelete: () => void;
}) {
  const [fullName, setFullName] = useState(member.fullName);
  const [position, setPosition] = useState(member.position);
  const [bio, setBio] = useState(member.bio ?? "");
  const [active, setActive] = useState(member.isActive);

  useEffect(() => {
    setFullName(member.fullName);
    setPosition(member.position);
    setBio(member.bio ?? "");
    setActive(member.isActive);
  }, [member]);

  return (
    <li className="border border-walnut/10 p-4 space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-xs uppercase text-walnut/60">
          Name
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full border px-2 py-1.5 text-sm bg-white" />
        </label>
        <label className="block text-xs uppercase text-walnut/60">
          Position
          <input value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1 w-full border px-2 py-1.5 text-sm bg-white" />
        </label>
      </div>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="w-full border px-2 py-1.5 text-sm bg-white" placeholder="Bio" />
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={active} onCheckedChange={setActive} />
        Active on site
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onSave({ fullName, position, bio, isActive: active })} className="px-3 py-1.5 bg-wine text-cream text-xs uppercase">
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
