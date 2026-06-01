import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin/login") {
      return;
    }

    if (typeof window !== "undefined" && !getAuth()) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});
