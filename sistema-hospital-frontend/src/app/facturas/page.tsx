// app/facturas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FacturaService } from "../services/factura-service";
import { FacturaList } from "../../components/facturas/factura-list";
import { useRouter } from "next/navigation";
import type { Factura } from "../types/factura";
import { toast } from "sonner";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await FacturaService.listAll();
      setFacturas(data);
    } catch (e: any) {
      toast.error("Error", { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacturaList
      facturas={facturas}
      isLoading={loading}
      onAdd={() => router.push("/facturas/nueva")}
      onView={f => router.push(`/facturas/${f.id}`)}
      onDelete={async id => {
        await FacturaService.delete(id);
        load();
        toast.success("Factura eliminada");
      }}
    />
  );
}
