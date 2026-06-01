import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { LogoOnDarkPanel } from "@/components/site/Logo";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.login(username, password);
      if (!result.success || !result.data) {
        setError(result.message ?? "Login failed.");
        return;
      }
      setAuth({
        token: result.data.token,
        username: result.data.username,
        role: result.data.role,
        expiresAt: result.data.expiresAt,
      });
      navigate({ to: "/admin" });
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-walnut flex items-center justify-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-gold/30 bg-cream p-10 space-y-6"
      >
        <div className="text-center flex flex-col items-center">
          <LogoOnDarkPanel variant="admin" className="[&_img]:!h-28" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold mt-3">Admin Login</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-walnut/60">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full border-b border-walnut/25 py-2 bg-transparent focus:outline-none focus:border-gold"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-walnut/60">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border-b border-walnut/25 py-2 bg-transparent focus:outline-none focus:border-gold"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-wine">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-walnut py-3 uppercase text-[11px] tracking-[0.2em] font-medium hover:bg-wine hover:text-cream transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
