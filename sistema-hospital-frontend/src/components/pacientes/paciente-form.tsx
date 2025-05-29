"use client"

import type React from "react"

import { useState } from "react"
// Update the import path if necessary, for example:
import { Button } from "../ui/button"
// Or provide the correct relative path based on your project structure
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Textarea } from "../ui/textarea"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "../../lib/utils"
import type { Paciente, PacienteFormData } from "../../app/types/paciente"

interface PacienteFormProps {
  paciente?: Paciente
  onSubmit: (data: PacienteFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function PacienteForm({ paciente, onSubmit, onCancel, isLoading }: PacienteFormProps) {
  const [formData, setFormData] = useState<PacienteFormData>({
    nombre: paciente?.nombre || "",
    documentoIdentidad: paciente?.documentoIdentidad || "",
    fechaNacimiento: paciente?.fechaNacimiento || "",
    telefono: paciente?.telefono || "",
    direccion: paciente?.direccion || "",
  })

  const [date, setDate] = useState<Date | undefined>(
    paciente?.fechaNacimiento ? new Date(paciente.fechaNacimiento) : undefined,
  )

  const [errors, setErrors] = useState<Partial<PacienteFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<PacienteFormData> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.documentoIdentidad.trim()) {
      newErrors.documentoIdentidad = "El documento de identidad es requerido"
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es requerida"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error al guardar paciente:", error)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        fechaNacimiento: selectedDate.toISOString().split("T")[0],
      }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{paciente ? "Editar Paciente" : "Nuevo Paciente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ingrese el nombre completo"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentoIdentidad">Documento de Identidad</Label>
              <Input
                id="documentoIdentidad"
                value={formData.documentoIdentidad}
                onChange={(e) => setFormData((prev) => ({ ...prev, documentoIdentidad: e.target.value }))}
                placeholder="Ej: 12345678"
                className={errors.documentoIdentidad ? "border-red-500" : ""}
              />
              {errors.documentoIdentidad && <p className="text-sm text-red-500">{errors.documentoIdentidad}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      errors.fechaNacimiento && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
              {errors.fechaNacimiento && <p className="text-sm text-red-500">{errors.fechaNacimiento}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                placeholder="Ej: +57 300 123 4567"
                className={errors.telefono ? "border-red-500" : ""}
              />
              {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Textarea
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
              placeholder="Ingrese la dirección completa"
              className={errors.direccion ? "border-red-500" : ""}
              rows={3}
            />
            {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {paciente ? "Actualizar" : "Crear"} Paciente
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
