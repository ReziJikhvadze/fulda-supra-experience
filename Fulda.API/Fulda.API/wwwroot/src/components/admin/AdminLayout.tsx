import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { clearAuth, getAuth } from "@/lib/auth";

const nav = [
  { to: "/admin", label: "Reservations", exact: true },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/wines", label: "Wines" },
  { to: "/admin/staff", label: "Staff" },
] as const;

export function AdminLayout() {
  const navigate = useNavigate();
  const auth = getAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <Outlet />;
  }

  if (!auth) {
    return null;
  }

  const logout = () => {
    clearAuth();
    navigate({ to: "/admin/login" });
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-cream text-walnut flex">
      <aside className="w-56 shrink-0 bg-walnut text-cream flex flex-col">
        <div className="p-6 border-b border-cream/10">
          <p className="font-serif italic text-xl">Am Stockhaus</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold mt-1">Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.to || pathname === "/admin/"
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 text-sm rounded transition-colors ${
                  active ? "bg-wine text-cream" : "text-cream/75 hover:text-gold"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-cream/10 text-sm">
          <p className="text-cream/60 text-xs mb-2">{auth.username}</p>
          <button onClick={logout} className="text-gold hover:text-cream text-xs uppercase tracking-wider">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
    </>
  );
}
