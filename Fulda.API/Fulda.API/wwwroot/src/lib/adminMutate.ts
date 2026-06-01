import { toast } from "sonner";
import type { ApiResult } from "@/lib/api";

export async function adminMutate<T>(
  successMessage: string,
  action: () => Promise<ApiResult<T>>,
): Promise<boolean> {
  const result = await action();
  if (!result.success) {
    toast.error(result.message ?? "Request failed", {
      description: result.errors?.join(", "),
    });
    return false;
  }
  toast.success(successMessage);
  return true;
}
