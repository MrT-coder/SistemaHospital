// app/services/documento-service.ts
import type { Descargo } from "../types/descargo";
import type { Factura } from "../types/factura";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class DocumentoService {
  static async descargarDescargo(id: number): Promise<Descargo> {
    const res = await fetch(`${API}/api/documentos/descargos/${id}/descargar`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async facturarDescargo(id: number): Promise<Factura> {
    const res = await fetch(`${API}/api/documentos/descargos/${id}/facturar`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
