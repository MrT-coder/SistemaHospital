"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FacturaService } from "../../services/factura-service";
import { Button } from "../../../components/ui/button";

export default function FacturaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [fac, setFac] = useState<any>(null);

  useEffect(() => {
    FacturaService.getById(Number(id)).then(setFac);
  }, [id]);

  if (!fac) return <p>Cargando factura…</p>;

  return (
    <div className="p-6 space-y-4">
      {/* ← Botón de volver atrás */}
      <Button variant="outline" onClick={() => router.push("/facturas")}>
        ← Volver
      </Button>

      <h1 className="text-2xl font-bold">Factura #{fac.nroFactura}</h1>
      <p>Emitida: {new Date(fac.fechaEmision).toLocaleString()}</p>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Descripción</th>
            <th className="p-2">Cant.</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {fac.lineas.map((l: any) => (
            <tr key={l.id}>
              <td className="p-2">{l.servicio?.descripcion || l.producto?.descripcion}</td>
              <td className="p-2">{l.cantidad}</td>
              <td className="p-2">${l.precioUnitario.toFixed(2)}</td>
              <td className="p-2">${l.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Total: ${fac.valorTotal.toFixed(2)}</span>

        <Button
          variant="destructive"
          onClick={async () => {
            await FacturaService.delete(fac.id);
            router.push("/facturas");
          }}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}
