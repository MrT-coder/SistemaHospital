"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Calendar } from "../../components/ui/calendar"
import { Loader2, CalendarIcon, FileText, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "../../lib/utils"
import type { Descargo, DescargoFormData } from "../../app/types/descargo"
import type { Paciente } from "../../app/types/paciente"
import { PacienteService } from "../../app/services/paciente-service"

interface DescargoFormProps {
  descargo?: Descargo
  onSubmit: (data: DescargoFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function DescargoForm({ descargo, onSubmit, onCancel, isLoading }: DescargoFormProps) {
  const [formData, setFormData] = useState<DescargoFormData>({
    nro: descargo?.nro || "",
    fecha: descargo?.fecha || new Date().toISOString(),
    pacienteId: descargo?.pacienteId || 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [isLoadingPacientes, setIsLoadingPacientes] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.fecha ? new Date(formData.fecha) : new Date(),
  )

  useEffect(() => {
    loadPacientes()
  }, [])

  const loadPacientes = async () => {
    setIsLoadingPacientes(true)
    try {
      const data = await PacienteService.getAll()
      setPacientes(data)
    } catch (error) {
      console.error("Error al cargar pacientes:", error)
    } finally {
      setIsLoadingPacientes(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nro.trim()) {
      newErrors.nro = "El número de descargo es requerido"
    }

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida"
    }

    if (!formData.pacienteId || formData.pacienteId === 0) {
      newErrors.pacienteId = "Debe seleccionar un paciente"
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
      console.error("Error al guardar descargo:", error)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setSelectedDate(selectedDate)
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        fecha: selectedDate.toISOString(),
      }))
    }
  }

  const selectedPaciente = pacientes.find((p) => p.id === formData.pacienteId)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {descargo ? "Editar Descargo" : "Nuevo Descargo"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nro">Número de Descargo</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nro"
                  value={formData.nro}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nro: e.target.value }))}
                  placeholder="Ej: DESC-001"
                  className={`pl-10 ${errors.nro ? "border-red-500" : ""}`}
                />
              </div>
              {errors.nro && <p className="text-sm text-red-500">{errors.nro}</p>}
            </div>

            <div className="space-y-2">
              <Label>Fecha del Descargo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      errors.fecha && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.fecha && <p className="text-sm text-red-500">{errors.fecha}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pacienteId">Paciente</Label>
            <Select
              value={formData.pacienteId.toString()}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, pacienteId: Number.parseInt(value) }))}
              disabled={isLoadingPacientes}
            >
              <SelectTrigger className={errors.pacienteId ? "border-red-500" : ""}>
                <SelectValue placeholder={isLoadingPacientes ? "Cargando pacientes..." : "Selecciona un paciente"}>
                  {selectedPaciente && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{selectedPaciente.nombre}</span>
                      <span className="text-muted-foreground">({selectedPaciente.documentoIdentidad})</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {pacientes.map((paciente) => (
                  <SelectItem key={paciente.id} value={paciente.id!.toString()}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{paciente.nombre}</span>
                      <span className="text-muted-foreground">({paciente.documentoIdentidad})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pacienteId && <p className="text-sm text-red-500">{errors.pacienteId}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {descargo ? "Actualizar" : "Crear"} Descargo
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
