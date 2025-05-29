// components/facturas/factura-list.tsx
"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell,
} from "../ui/table";
import { Search, Plus, Eye, Trash2, DollarSign, Calendar, User } from "lucide-react";
import { Factura } from "../../app/types/factura";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface FacturaListProps {
  facturas: Factura[];
  onView: (f: Factura) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export function FacturaList({ facturas, onView, onDelete, onAdd, isLoading }: FacturaListProps) {
  const [search, setSearch] = useState("");

  const filtered = facturas.filter(f =>
    f.nroFactura.toLowerCase().includes(search.toLowerCase())
  );

  const fmtDate = (s: string) => format(new Date(s), "dd/MM/yyyy HH:mm", { locale: es });
  const fmtPrice = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Input
              placeholder="Buscar por Nº factura..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Cargando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay facturas.</p>
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Factura</TableHead>
                    <TableHead>Emitida</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(f => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.nroFactura}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {fmtDate(f.fechaEmision)}
                        </div>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        {fmtPrice(f.valorTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => onView(f)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(f.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
