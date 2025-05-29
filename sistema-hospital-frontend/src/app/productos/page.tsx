"use client"

import { useState, useEffect } from "react"
import { ProductoList } from "../../components/productos/producto-list"
import { ProductoForm } from "../../components/productos/producto-form"
import { ProductoService } from "../services/producto-service"
import type { Producto, ProductoFormData } from "../../app/types/producto"
import { toast } from "sonner"
import { ArrowLeft, Server, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Alert, AlertDescription } from "../../components/ui/alert"

type ViewMode = "list" | "create" | "edit"

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedProducto, setSelectedProducto] = useState<Producto | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    setIsLoading(true)
    setConnectionError(null)

    try {
      console.log("🔄 Intentando cargar productos...")
      const data = await ProductoService.getAll()
      console.log("✅ Productos cargados exitosamente:", data.length)
      setProductos(data)

      toast.success("Conexión Exitosa", {
        description: `Se cargaron ${data.length} productos desde el backend`,
      })
    } catch (error: any) {
      console.error("❌ Error al cargar productos:", error)
      setConnectionError(error.message)

      toast.error("Error de Conexión", {
        description: "No se pudo conectar al backend de productos.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedProducto(undefined)
    setViewMode("create")
  }

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto)
    setViewMode("edit")
  }

  const handleDelete = async (id: number) => {
    try {
      await ProductoService.delete(id)
      setProductos((prev) => prev.filter((p) => p.id !== id))
      toast.success("Éxito", {
        description: "Producto eliminado correctamente",
      })
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo eliminar el producto",
      })
    }
  }

  const handleSubmit = async (data: ProductoFormData) => {
    setIsFormLoading(true)
    try {
      if (viewMode === "create") {
        const newProducto = await ProductoService.create(data)
        setProductos((prev) => [...prev, newProducto])
        toast.success("Éxito", {
          description: "Producto creado correctamente",
        })
      } else if (viewMode === "edit" && selectedProducto?.id) {
        const updatedProducto = await ProductoService.update(selectedProducto.id, data)
        setProductos((prev) => prev.map((p) => (p.id === selectedProducto.id ? updatedProducto : p)))
        toast.success("Éxito", {
          description: "Producto actualizado correctamente",
        })
      }
      setViewMode("list")
      setSelectedProducto(undefined)
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || `No se pudo ${viewMode === "create" ? "crear" : "actualizar"} el producto`,
      })
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleCancel = () => {
    setViewMode("list")
    setSelectedProducto(undefined)
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
                <Button variant="outline" size="sm" onClick={loadProductos} disabled={isLoading}>
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
              /api/productos
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Contenido principal */}
      {viewMode === "list" ? (
        <ProductoList
          productos={productos}
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
          <ProductoForm
            producto={selectedProducto}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isFormLoading}
          />
        </div>
      )}
    </div>
  )
}
