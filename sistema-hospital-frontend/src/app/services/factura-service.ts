// app/services/factura-service.ts
import type { Factura } from "../types/factura";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class FacturaService {
  static async getAll(): Promise<Factura[]> {
    const res = await fetch(`${API}/api/facturas`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async getById(id: number): Promise<Factura> {
    const res = await fetch(`${API}/api/facturas/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async delete(id: number): Promise<void> {
    const res = await fetch(`${API}/api/facturas/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
  }
}
