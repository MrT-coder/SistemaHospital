"use client"

import { useState, useEffect } from "react"
import { PacienteList } from "../../components/pacientes/paciente-list"
import { PacienteForm } from "../../components/pacientes/paciente-form"
import { PacienteService } from "../../app/services/paciente-service"
import type { Paciente, PacienteFormData } from "../types/paciente"
import { toast } from "sonner"
import { ArrowLeft, Server, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "../../components/ui/button"
import { ConnectionTest } from "../../components/debug/connection-test"
import { Alert, AlertDescription } from "../../components/ui/alert"

type ViewMode = "list" | "create" | "edit"

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    loadPacientes()
  }, [])

  const loadPacientes = async () => {
    setIsLoading(true)
    setConnectionError(null)

    try {
      console.log("🔄 Intentando cargar pacientes...")
      const data = await PacienteService.getAll()
      console.log("✅ Pacientes cargados exitosamente:", data.length)
      setPacientes(data)

      toast.success("Conexión Exitosa", {
        description: `Se cargaron ${data.length} pacientes desde el backend`,
      })
    } catch (error: any) {
      console.error("❌ Error al cargar pacientes:", error)
      setConnectionError(error.message)

      toast.error("Error de Conexión", {
        description: "No se pudo conectar al backend. Usa el diagnóstico para más detalles.",
      })

      // Auto-show debug on error
      setShowDebug(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedPaciente(undefined)
    setViewMode("create")
  }

  const handleEdit = (paciente: Paciente) => {
    setSelectedPaciente(paciente)
    setViewMode("edit")
  }

  const handleDelete = async (id: number) => {
    try {
      await PacienteService.delete(id)
      setPacientes((prev) => prev.filter((p) => p.id !== id))
      toast.success("Éxito", {
        description: "Paciente eliminado correctamente",
      })
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo eliminar el paciente",
      })
    }
  }

  const handleSubmit = async (data: PacienteFormData) => {
    setIsFormLoading(true)
    try {
      if (viewMode === "create") {
        const newPaciente = await PacienteService.create(data)
        setPacientes((prev) => [...prev, newPaciente])
        toast.success("Éxito", {
          description: "Paciente creado correctamente",
        })
      } else if (viewMode === "edit" && selectedPaciente?.id) {
        const updatedPaciente = await PacienteService.update(selectedPaciente.id, data)
        setPacientes((prev) => prev.map((p) => (p.id === selectedPaciente.id ? updatedPaciente : p)))
        toast.success("Éxito", {
          description: "Paciente actualizado correctamente",
        })
      }
      setViewMode("list")
      setSelectedPaciente(undefined)
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || `No se pudo ${viewMode === "create" ? "crear" : "actualizar"} el paciente`,
      })
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleCancel = () => {
    setViewMode("list")
    setSelectedPaciente(undefined)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Error de conexión */}
      {connectionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div>
                <strong>Error de Conexión al Backend:</strong>
              </div>
              <div className="text-sm bg-destructive/10 p-2 rounded">{connectionError}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadPacientes} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1 h-3 w-3" />
                  )}
                  Reintentar
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDebug(true)}>
                  Diagnosticar
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Indicador de backend */}
      {!connectionError && (
        <Alert className="mb-4">
          <Server className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Backend Conectado:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
                /api/pacientes
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)}>
                {showDebug ? "Ocultar" : "Mostrar"} Diagnóstico
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Panel de Debug */}
      {showDebug && (
        <div className="mb-6">
          <ConnectionTest />
        </div>
      )}

      {/* Contenido principal */}
      {viewMode === "list" ? (
        <PacienteList
          pacientes={pacientes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleCreate}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-4">
          <Button variant="outline" onClick={handleCancel} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Button>
          <PacienteForm
            paciente={selectedPaciente}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isFormLoading}
          />
        </div>
      )}
    </div>
  )
}
