import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { reservationsApi, type ReservationDto } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { createReservationHubConnection } from "@/lib/reservationHub";

export function AdminReservations() {
  const [rows, setRows] = useState<ReservationDto[]>([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      setError("Not signed in. Go to /admin/login.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await reservationsApi.list(
      { search: search || undefined, date: date || undefined, status: status || undefined },
      token,
    );
    if (result.success && result.data) setRows(result.data);
    else setError(result.message ?? "Failed to load reservations.");
    setLoading(false);
  }, [search, date, status]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const connection = createReservationHubConnection();

    connection.on("ReservationCreated", (reservation: ReservationDto) => {
      if (rowsRef.current.some((r) => r.id === reservation.id)) return;
      setRows((prev) => [reservation, ...prev]);
      toast.success("New reservation", {
        description: `${reservation.customerName} · ${reservation.reservationDate} · ${reservation.guestCount} guests`,
        duration: 8000,
      });
    });

    connection
      .start()
      .then(() => setLive(true))
      .catch(() => setLive(false));

    return () => {
      void connection.stop();
      setLive(false);
    };
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    const token = getToken();
    if (!token) return;
    await reservationsApi.updateStatus(id, newStatus, token);
    void load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this reservation?")) return;
    const token = getToken();
    if (!token) return;
    await reservationsApi.delete(id, token);
    void load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif italic text-3xl text-wine">Reservations</h1>
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-1 border ${
            live ? "border-green-600 text-green-700" : "border-walnut/30 text-walnut/50"
          }`}
        >
          {live ? "Live updates on" : "Live updates off"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Search name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-walnut/20 px-3 py-2 text-sm bg-white min-w-[200px]"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-walnut/20 px-3 py-2 text-sm bg-white" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-walnut/20 px-3 py-2 text-sm bg-white">
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="button" onClick={() => void load()} className="px-4 py-2 bg-wine text-cream text-xs uppercase tracking-wider">
          Refresh
        </button>
      </div>

      {loading && <p className="text-walnut/60">Loading…</p>}
      {error && <p className="text-wine text-sm">{error}</p>}

      <div className="overflow-x-auto border border-walnut/10">
        <table className="w-full text-sm">
          <thead className="bg-walnut/5 text-left">
            <tr>
              <th className="p-3">Guest</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Date / Time</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-walnut/10">
                <td className="p-3">
                  <div className="font-medium">{r.customerName}</div>
                  {r.specialRequest && <p className="text-xs text-walnut/60 mt-1">{r.specialRequest}</p>}
                </td>
                <td className="p-3 text-xs">
                  <div>{r.email}</div>
                  <div>{r.phone}</div>
                </td>
                <td className="p-3">
                  {r.reservationDate}
                  <br />
                  {String(r.reservationTime).slice(0, 5)}
                </td>
                <td className="p-3">{r.guestCount}</td>
                <td className="p-3">
                  <span className="text-xs uppercase tracking-wider text-gold">{r.status}</span>
                </td>
                <td className="p-3 space-x-2">
                  {r.status !== "Confirmed" && (
                    <button type="button" onClick={() => void updateStatus(r.id, "Confirmed")} className="text-xs text-wine hover:underline">
                      Confirm
                    </button>
                  )}
                  {r.status !== "Cancelled" && (
                    <button type="button" onClick={() => void updateStatus(r.id, "Cancelled")} className="text-xs text-walnut/70 hover:underline">
                      Cancel
                    </button>
                  )}
                  <button type="button" onClick={() => void remove(r.id)} className="text-xs text-wine hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-walnut/50">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
