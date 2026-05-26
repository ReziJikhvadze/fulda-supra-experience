const TOKEN_KEY = "fulda_admin_token";
const USER_KEY = "fulda_admin_user";

export type StoredAuth = {
  token: string;
  username: string;
  role: string;
  expiresAt: string;
};

export function getAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  if (!token || !user) return null;
  try {
    const parsed = JSON.parse(user) as StoredAuth;
    if (new Date(parsed.expiresAt) <= new Date()) {
      clearAuth();
      return null;
    }
    return { ...parsed, token };
  } catch {
    return null;
  }
}

export function setAuth(auth: StoredAuth) {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(USER_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return getAuth()?.token ?? null;
}
