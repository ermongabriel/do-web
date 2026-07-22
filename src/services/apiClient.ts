export class ApiClient {
  private baseUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "") + "/api";

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, { credentials: "include" });
    if (!res.ok) throw new ApiError(res.status, await this.parseBody(res));
    return res.json() as Promise<T>;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new ApiError(res.status, await this.parseBody(res));
    return res.json() as Promise<T>;
  }

  private async parseBody(res: Response) {
    try {
      return await res.json();
    } catch {
      return { message: res.statusText };
    }
  }
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API error ${status}`);
    this.status = status;
    this.body = body;
  }
}
