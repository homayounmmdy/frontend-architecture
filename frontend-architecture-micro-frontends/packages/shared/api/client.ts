import { getStoredAuthToken } from "@commerceos/shared/lib/auth-storage";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const response = await fetch(input, {
    headers: {
      ...(getStoredAuthToken() ? { Authorization: `Bearer ${getStoredAuthToken()}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(input: string) => request<T>(input),
  post: <T>(input: string, body: unknown) =>
    request<T>(input, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: <T>(input: string, body: unknown) =>
    request<T>(input, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
