import { useCallback, useEffect, useState } from "react";
import { apiDelete, apiPost, apiPut, apiUpload, staffApi, type StaffMemberDto } from "@/lib/api";
import { getToken } from "@/lib/auth";

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

  const addMember = async () => {
    const token = getToken();
    if (!token) return;
    const fullName = prompt("Full name?");
    if (!fullName) return;
    const position = prompt("Position?", "Chef");
    if (!position) return;
    await apiPost(
      "/api/staff",
      {
        fullName,
        position,
        bio: "",
        displayOrder: members.length + 1,
        isActive: true,
      },
      token,
    );
    void load();
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
      await apiPut(
        `/api/staff/${member.id}`,
        {
          fullName: member.fullName,
          position: member.position,
          bio: member.bio,
          imageUrl: uploaded.data.url,
          displayOrder: member.displayOrder,
          isActive: member.isActive,
        },
        token,
      );
      void load();
    };
    input.click();
  };

  const deleteMember = async (id: number) => {
    if (!confirm("Delete this staff member?")) return;
    const token = getToken();
    if (!token) return;
    await apiDelete(`/api/staff/${id}`, token);
    void load();
  };

  if (loading) return <p>Loading staff…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif italic text-3xl text-wine">Staff</h1>
        <button onClick={() => void addMember()} className="px-4 py-2 bg-gold text-walnut text-xs uppercase tracking-wider">
          Add staff member
        </button>
      </div>

      <ul className="space-y-4">
        {members.map((m) => (
          <li key={m.id} className="border border-walnut/10 p-4 flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-medium">{m.fullName}</p>
              <p className="text-sm text-walnut/70">{m.position}</p>
              {m.bio && <p className="text-xs text-walnut/60 mt-1">{m.bio}</p>}
            </div>
            <div className="space-x-3 text-xs self-center">
              <button onClick={() => void uploadImage(m)} className="hover:underline">
                Upload image
              </button>
              <button onClick={() => void deleteMember(m.id)} className="text-wine hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
