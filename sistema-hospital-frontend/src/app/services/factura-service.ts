// app/services/factura-service.ts
import type { Factura } from "../types/factura";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class FacturaService {
  private static async req<T>(url: string, opts: RequestInit = {}) {
    const res = await fetch(`${API_BASE}/api${url}`, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.status === 204 ? ({} as T) : res.json() as Promise<T>;
  }

  static listAll() {
    return this.req<Factura[]>("/facturas", { method: "GET" });
  }

  static getById(id: number) {
    return this.req<Factura>(`/facturas/${id}`, { method: "GET" });
  }

  static delete(id: number) {
    return this.req<void>(`/facturas/${id}`, { method: "DELETE" });
  }
}
