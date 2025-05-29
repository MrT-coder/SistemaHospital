export type EstadoDocumento = "PENDIENTE" | "DESCARGADO" | "FACTURADO"

export interface DescargoBase {
  id?: number
  nro: string
  fecha: string // ISO datetime string
  fechaDescargo: string // ISO datetime string
  valorTotal: number
  pacienteId: number
  estado?: EstadoDocumento
}

export interface Descargo extends DescargoBase {
  lineasServicio?: LineaServicio[]
  lineasProducto?: LineaProducto[]
  paciente?: {
    id: number
    nombre: string
    documentoIdentidad: string
  }
}

export interface DescargoFormData {
  nro: string
  fecha: string
  pacienteId: number
}

export interface DescargoUpdateData {
  nro: string
  fecha: string
  pacienteId: number
}

export interface LineaBase {
  id?: number
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface LineaServicio extends LineaBase {
  servicioId: number
  servicio?: {
    id: number
    descripcion: string
    precio: number
    servicioTipo: string
  }
}

export interface LineaProducto extends LineaBase {
  productoId: number
  producto?: {
    id: number
    descripcion: string
    precio: number
    productoTipo: string
  }
}

export interface LineaServicioFormData {
  servicioId: number
  cantidad: number
}

export interface LineaProductoFormData {
  productoId: number
  cantidad: number
}

export const ESTADOS_DOCUMENTO = [
  { value: "PENDIENTE", label: "Pendiente", color: "yellow" },
  { value: "DESCARGADO", label: "Descargado", color: "blue" },
  { value: "FACTURADO", label: "Facturado", color: "green" },
] as const
