export interface Paciente {
  id?: number
  nombre: string
  documentoIdentidad: string
  fechaNacimiento: string // ISO date string
  telefono: string
  direccion: string
}

export interface PacienteFormData {
  nombre: string
  documentoIdentidad: string
  fechaNacimiento: string
  telefono: string
  direccion: string
}
