import { createFileRoute } from "@tanstack/react-router";
import { AdminReservations } from "@/components/admin/AdminReservations";

export const Route = createFileRoute("/admin/")({
  component: AdminReservations,
});
