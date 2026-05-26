import { createFileRoute } from "@tanstack/react-router";
import { AdminWines } from "@/components/admin/AdminWines";

export const Route = createFileRoute("/admin/wines")({
  component: AdminWines,
});
