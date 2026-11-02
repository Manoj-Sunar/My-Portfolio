// src/lib/apiClient.ts
const API_URL =
  process.env.API_URL ??              // server-only (internal)
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

/* ---------- SERVER ---------- */
type ServerOpts = RequestInit & {
  revalidate?: number | false;
  tags?: string[];
};

export async function serverApi<T>(endpoint: string, opts: ServerOpts = {}): Promise<T> {
  const { revalidate = 300, tags, ...rest } = opts;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      ...(rest.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...rest.headers,
    },
    next: { revalidate, tags },
    // forward cookies for any authed server calls
    credentials: "include",
    cache: revalidate === false ? "no-store" : undefined,
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(e.message ?? `Request failed: ${res.status}`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

/* ---------- CLIENT (unchanged, React Query) ---------- */
export async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(e.message ?? `Request failed: ${res.status}`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}