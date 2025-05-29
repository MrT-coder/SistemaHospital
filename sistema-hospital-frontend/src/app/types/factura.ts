// app/types/factura.ts
export type EstadoDocumento = "PENDIENTE" | "DESCARGADO" | "FACTURADO";

export interface LineaFactura {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  servicio?: { id: number; descripcion: string; precio: number } | null;
  producto?: { id: number; descripcion: string; precio: number } | null;
}

export interface Factura {
  id: number;
  nro: string;
  fecha: string;           // igual que en Descargo
  valorTotal: number;
  estado: EstadoDocumento;
  pacienteId: number;
  nroFactura: string;
  fechaEmision: string;
  lineas: LineaFactura[];
}
