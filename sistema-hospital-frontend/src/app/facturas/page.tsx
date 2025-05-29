// app/facturas/page.tsx
import Link from "next/link";
import { use } from "react";
import { FacturaService } from "../services/factura-service";

export default async function FacturaListPage() {
  const facturas = await FacturaService.getAll();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Facturas</h1>
      <ul className="space-y-2">
        {facturas.map((f) => (
          <li key={f.id} className="p-4 border rounded hover:bg-gray-50 flex justify-between">
            <Link href={`/facturas/${f.id}`}>
              #{f.nroFactura} — {new Date(f.fechaEmision).toLocaleDateString()}
            </Link>
            <span className="font-semibold text-green-600">${f.valorTotal.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
