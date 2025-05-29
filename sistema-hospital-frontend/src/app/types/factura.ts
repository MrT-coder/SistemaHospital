// app/types/factura.ts

export type EstadoDocumento = "PENDIENTE" | "DESCARGADO" | "FACTURADO"

export interface Servicio {
  id: number
  descripcion: string
  precio: number
}

export interface Producto {
  id: number
  descripcion: string
  precio: number
}

export interface Linea {
  id?: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  servicio?: Servicio | null
  producto?: Producto | null
}

export interface Factura {
  id?: number
  nro: string
  fecha: string           // ISO datetime string
  valorTotal: number
  estado: EstadoDocumento
  pacienteId: number
  nroFactura: string
  fechaEmision: string    // ISO datetime string
  lineas: Linea[]
}
