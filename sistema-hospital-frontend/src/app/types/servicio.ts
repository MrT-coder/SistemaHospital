export interface ServicioBase {
  id?: number
  descripcion: string
  precio: number
  servicioTipo: ServicioTipo
}

export type ServicioTipo = "ATENCION_MEDICA" | "EXAMEN_LAB" | "IMAGEN_RAYOS_X" | "PROCEDIMIENTO_MEDICO"

export interface AtencionMedica extends ServicioBase {
  servicioTipo: "ATENCION_MEDICA"
  duracion: string // Duration en formato HH:MM
  medico: string
}

export interface ExamenLab extends ServicioBase {
  servicioTipo: "EXAMEN_LAB"
  tipoExamen: string
}

export interface ImagenRayosX extends ServicioBase {
  servicioTipo: "IMAGEN_RAYOS_X"
  region: string
}

export interface ProcedimientoMedico extends ServicioBase {
  servicioTipo: "PROCEDIMIENTO_MEDICO"
  nombreProcedimiento: string
}

export type Servicio = AtencionMedica | ExamenLab | ImagenRayosX | ProcedimientoMedico

export interface ServicioFormData {
  descripcion: string
  precio: number
  servicioTipo: ServicioTipo
  // Campos adicionales
  duracion?: string
  medico?: string
  tipoExamen?: string
  region?: string
  nombreProcedimiento?: string
}

export const SERVICIO_TIPOS = [
  { value: "ATENCION_MEDICA", label: "Atención Médica" },
  { value: "EXAMEN_LAB", label: "Examen de Laboratorio" },
  { value: "IMAGEN_RAYOS_X", label: "Imagen de Rayos X" },
  { value: "PROCEDIMIENTO_MEDICO", label: "Procedimiento Médico" },
] as const
