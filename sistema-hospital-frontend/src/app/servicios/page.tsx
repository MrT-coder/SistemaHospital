"use client"

import { useState, useEffect } from "react"
import { ServicioList } from "../../components/servicios/servicio-list"
import { ServicioForm } from "../../components/servicios/servicio-form"
import { ServicioService } from "../services/servicio-service"
import type { Servicio, ServicioFormData } from "../types/servicio"
import { toast } from "sonner"
import { ArrowLeft, Server, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Alert, AlertDescription } from "../../components/ui/alert"

type ViewMode = "list" | "create" | "edit"

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedServicio, setSelectedServicio] = useState<Servicio | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    loadServicios()
  }, [])

  const loadServicios = async () => {
    setIsLoading(true)
    setConnectionError(null)

    try {
      console.log("🔄 Intentando cargar servicios...")
      const data = await ServicioService.getAll()
      console.log("✅ Servicios cargados exitosamente:", data.length)
      setServicios(data)

      toast.success("Conexión Exitosa", {
        description: `Se cargaron ${data.length} servicios desde el backend`,
      })
    } catch (error: any) {
      console.error("❌ Error al cargar servicios:", error)
      setConnectionError(error.message)

      toast.error("Error de Conexión", {
        description: "No se pudo conectar al backend de servicios.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedServicio(undefined)
    setViewMode("create")
  }

  const handleEdit = (servicio: Servicio) => {
    setSelectedServicio(servicio)
    setViewMode("edit")
  }

  const handleDelete = async (id: number) => {
    try {
      await ServicioService.delete(id)
      setServicios((prev) => prev.filter((s) => s.id !== id))
      toast.success("Éxito", {
        description: "Servicio eliminado correctamente",
      })
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo eliminar el servicio",
      })
    }
  }

  const handleSubmit = async (data: ServicioFormData) => {
    setIsFormLoading(true)
    try {
      if (viewMode === "create") {
        const newServicio = await ServicioService.create(data)
        setServicios((prev) => [...prev, newServicio])
        toast.success("Éxito", {
          description: "Servicio creado correctamente",
        })
      } else if (viewMode === "edit" && selectedServicio?.id) {
        const updatedServicio = await ServicioService.update(selectedServicio.id, data)
        setServicios((prev) => prev.map((s) => (s.id === selectedServicio.id ? updatedServicio : s)))
        toast.success("Éxito", {
          description: "Servicio actualizado correctamente",
        })
      }
      setViewMode("list")
      setSelectedServicio(undefined)
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || `No se pudo ${viewMode === "create" ? "crear" : "actualizar"} el servicio`,
      })
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleCancel = () => {
    setViewMode("list")
    setSelectedServicio(undefined)
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
                <Button variant="outline" size="sm" onClick={loadServicios} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1 h-3 w-3" />
                  )}
                  Reintentar
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
            <div>
              <strong>Backend Conectado:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
              /api/servicios
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Contenido principal */}
      {viewMode === "list" ? (
        <ServicioList
          servicios={servicios}
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
          <ServicioForm
            servicio={selectedServicio}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isFormLoading}
          />
        </div>
      )}
    </div>
  )
}
