import { createFileRoute } from "@tanstack/react-router";
import { AdminStaff } from "@/components/admin/AdminStaff";

export const Route = createFileRoute("/admin/staff")({
  component: AdminStaff,
});
