const API_BASE_URL = "https://192.168.1.11:7000/api";

interface RefreshResponse {
  accessToken: string;
  userId: string;
}

let refreshPromise: Promise<string | null> | null = null;

function isAuthenticationEndpoint(endpoint: string): boolean {
  return (
    endpoint.startsWith("/auth/login") ||
    endpoint.startsWith("/auth/register") ||
    endpoint.startsWith("/auth/refresh") ||
    endpoint.startsWith("/auth/logout")
  );
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          localStorage.removeItem("accessToken");
          return null;
        }

        const data: RefreshResponse = await response.json();

        if (!data.accessToken) {
          localStorage.removeItem("accessToken");
          return null;
        }

        localStorage.setItem("accessToken", data.accessToken);

        return data.accessToken;
      } catch {
        localStorage.removeItem("accessToken");
        return null;
      }
    })();
  }

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function sendRequest(
  endpoint: string,
  options: RequestInit,
  token: string | null,
): Promise<Response> {
  const headers = new Headers(options.headers);

  if (
    options.body !== undefined &&
    options.body !== null &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: options.credentials ?? "include",
  });
}

async function getErrorMessage(response: Response): Promise<string> {
  let errorMessage = "An error occurred.";

  try {
    const errorData = await response.json();

    errorMessage = errorData.message ?? errorData.title ?? errorMessage;
  } catch {
    // The response did not contain JSON.
  }

  return errorMessage;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let token = localStorage.getItem("accessToken");

  let response = await sendRequest(endpoint, options, token);

  const canRefresh =
    response.status === 401 && !isAuthenticationEndpoint(endpoint);

  if (canRefresh) {
    token = await refreshAccessToken();

    if (token) {
      response = await sendRequest(endpoint, options, token);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
