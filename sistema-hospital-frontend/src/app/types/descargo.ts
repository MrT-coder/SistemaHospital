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

export interface Linea {
  id?: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  servicio?: {
    id: number
    descripcion: string
    precio: number
  } | null
  producto?: {
    id: number
    descripcion: string
    precio: number
  } | null
}

export interface Descargo extends DescargoBase {
  lineas?: Linea[]
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
