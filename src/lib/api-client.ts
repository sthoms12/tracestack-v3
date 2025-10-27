import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(path, { ...init, headers });
  if (res.status === 204) { // No Content
    return null as T;
  }
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    if (res.status === 401) {
      // Handle unauthorized access, e.g., by clearing token and redirecting
      localStorage.removeItem('authToken');
      // This will trigger auth checks in the app to redirect to login
      window.dispatchEvent(new Event('storage')); 
    }
    throw new Error(json.error || 'Request failed');
  }
  return json.data;
}