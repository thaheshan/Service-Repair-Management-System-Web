import { BASE_URL, TOKEN_KEY } from "@/constants/api";

/**
 * Core request function for API calls
 */
async function request<T>(url: string, method: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle unauthorized
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      // Optional: window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  // Handle 404
  if (response.status === 404) {
    throw new Error(`Endpoint not found: ${url}`);
  }

  // Handle other errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  // Handle No Content (204)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Typed HTTP method helpers
 */
export const get = <T>(url: string) => request<T>(url, "GET");
export const post = <T>(url: string, body: unknown) => request<T>(url, "POST", body);
export const put = <T>(url: string, body: unknown) => request<T>(url, "PUT", body);
export const patch = <T>(url: string, body: unknown) => request<T>(url, "PATCH", body);
export const del = <T>(url: string) => request<T>(url, "DELETE");

/**
 * Export for backward compatibility (optional)
 */
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
};
