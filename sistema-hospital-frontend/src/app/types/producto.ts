export interface ProductoBase {
  id?: number
  descripcion: string
  precio: number
  productoTipo: ProductoTipo
}

export type ProductoTipo = "MEDICINA" | "COMIDA" | "CUARTO_HOSPITAL"

export interface Medicina extends ProductoBase {
  productoTipo: "MEDICINA"
  laboratorio: string
  dosis: string
}

export interface Comida extends ProductoBase {
  productoTipo: "COMIDA"
  valorNutricional: string
  tipoComida: string
}

export interface CuartoHospital extends ProductoBase {
  productoTipo: "CUARTO_HOSPITAL"
  numeroHabitacion: string
  fechaCheckIn: string // ISO date string
  fechaCheckOut: string // ISO date string
}

export type Producto = Medicina | Comida | CuartoHospital

export interface ProductoFormData {
  descripcion: string
  precio: number
  productoTipo: ProductoTipo
  // Campos adicionales
  laboratorio?: string
  dosis?: string
  valorNutricional?: string
  tipoComida?: string
  numeroHabitacion?: string
  fechaCheckIn?: string
  fechaCheckOut?: string
}

export const PRODUCTO_TIPOS = [
  { value: "MEDICINA", label: "Medicina" },
  { value: "COMIDA", label: "Comida" },
  { value: "CUARTO_HOSPITAL", label: "Cuarto de Hospital" },
] as const
