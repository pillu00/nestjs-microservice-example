export interface ServerError {
  status: number;
  statusText: string;
  message: string;
}

export default async function fetchData<T>(
  input: RequestInfo | URL,
  options?: RequestInit
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    "content-type": "application/json",
  };

  const response = await fetch(input, {
    ...options,
    headers: { ...defaultHeaders, ...(options?.headers ?? {}) },
  });
  try {
    const contentType =
      response.headers.get("content-type") ||
      response.headers.get("Content-Type");
    const contentTypeParsed = contentType?.toLowerCase();

    if (contentTypeParsed?.includes("application/json")) {
      const data = await response.json();
      if (response.ok) return data as T;
    }

    const serverError: ServerError = {
      message: "Unknown Response",
      status: response.status,
      statusText: response.statusText,
    };
    return Promise.reject(serverError);
  } catch (error) {
    return Promise.reject(error);
  }
}
