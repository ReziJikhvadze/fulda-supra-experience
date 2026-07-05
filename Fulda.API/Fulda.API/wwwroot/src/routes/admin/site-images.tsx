import { createFileRoute } from "@tanstack/react-router";
import { AdminSiteImages } from "@/components/admin/AdminSiteImages";

export const Route = createFileRoute("/admin/site-images")({
  component: AdminSiteImages,
});
