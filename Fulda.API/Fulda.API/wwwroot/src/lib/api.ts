const API_BASE = import.meta.env.VITE_API_URL ?? "";

export type ApiResult<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};

async function parseResponse<T>(response: Response): Promise<ApiResult<T>> {
  const body = (await response.json()) as ApiResult<T>;
  if (!response.ok) {
    return {
      success: false,
      message: body.message ?? "Request failed.",
      errors: body.errors,
    };
  }
  return body;
}

export async function apiGet<T>(path: string, token?: string | null): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { headers });
  return parseResponse<T>(response);
}

export async function apiPost<T>(path: string, body: unknown, token?: string | null): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export async function apiPut<T>(path: string, body: unknown, token?: string | null): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export async function apiDelete<T>(path: string, token?: string | null): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { method: "DELETE", headers });
  return parseResponse<T>(response);
}

export async function apiUpload(
  path: string,
  file: File,
  token: string,
): Promise<ApiResult<{ url: string; fileName: string }>> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return parseResponse(response);
}

// --- Types ---

export type ReservationDto = {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  specialRequest?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateReservationPayload = {
  customerName: string;
  email: string;
  phone: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  specialRequest?: string;
};

export type LoginResponse = {
  token: string;
  username: string;
  role: string;
  expiresAt: string;
};

export type MenuCategoryDto = {
  id: number;
  name: string;
  displayOrder: number;
  isActive: boolean;
  items: MenuItemDto[];
};

export type MenuItemDto = {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  displayOrder: number;
};

export type WineCategoryDto = {
  id: number;
  name: string;
  displayOrder: number;
  wines: WineDto[];
};

export type WineDto = {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  country?: string;
  year?: number;
  imageUrl?: string;
  isAvailable: boolean;
};

export type StaffMemberDto = {
  id: number;
  fullName: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
};

export const reservationsApi = {
  create: (payload: CreateReservationPayload) =>
    apiPost<ReservationDto>("/api/reservations", payload),
  list: (params: { search?: string; date?: string; status?: string }, token: string) => {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.date) q.set("date", params.date);
    if (params.status) q.set("status", params.status);
    const qs = q.toString();
    return apiGet<ReservationDto[]>(`/api/reservations${qs ? `?${qs}` : ""}`, token);
  },
  updateStatus: (id: number, status: string, token: string) =>
    apiPut<void>(`/api/reservations/${id}/status`, { status }, token),
  delete: (id: number, token: string) => apiDelete<void>(`/api/reservations/${id}`, token),
};

export const authApi = {
  login: (username: string, password: string) =>
    apiPost<LoginResponse>("/api/auth/login", { username, password }),
};

export const menuApi = {
  public: () => apiGet<MenuCategoryDto[]>("/api/menu"),
  signaturePlates: () => apiGet<MenuItemDto[]>("/api/menu/signature-plates"),
  admin: (token: string) => apiGet<MenuCategoryDto[]>("/api/menu/admin", token),
};

export const winesApi = {
  public: () => apiGet<WineCategoryDto[]>("/api/wines"),
  admin: (token: string) => apiGet<WineCategoryDto[]>("/api/wines/admin", token),
};

export const staffApi = {
  public: () => apiGet<StaffMemberDto[]>("/api/staff"),
  admin: (token: string) => apiGet<StaffMemberDto[]>("/api/staff/admin", token),
};
