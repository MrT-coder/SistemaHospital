"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Plus, Package, Wrench, Hash } from "lucide-react"
import type { Descargo, LineaServicioFormData, LineaProductoFormData } from "../../app/types/descargo"
import type { Servicio } from "../../app/types/servicio"
import type { Producto } from "../../app/types/producto"
import { ServicioService } from "../../app/services/servicio-service"
import { ProductoService } from "../../app/services/producto-service"
import { DescargoService } from "../../app/services/descargo-service"
import { toast } from "sonner"

interface DescargoLineasProps {
  descargo: Descargo
  onUpdate: () => void
}

export function DescargoLineas({ descargo, onUpdate }: DescargoLineasProps) {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoadingServicios, setIsLoadingServicios] = useState(false)
  const [isLoadingProductos, setIsLoadingProductos] = useState(false)
  const [isAddingLinea, setIsAddingLinea] = useState(false)

  const [lineaServicioForm, setLineaServicioForm] = useState<LineaServicioFormData>({
    servicioId: 0,
    cantidad: 1,
  })

  const [lineaProductoForm, setLineaProductoForm] = useState<LineaProductoFormData>({
    productoId: 0,
    cantidad: 1,
  })

  useEffect(() => {
    loadServicios()
    loadProductos()
    
    // Asegurarnos de que tenemos los datos más actualizados del descargo
    if (descargo.id) {
      const fetchDescargoDetails = async () => {
        try {
          const updatedDescargo = await DescargoService.getById(descargo.id!)
          // Actualizar localmente las líneas si existen
          if (updatedDescargo.lineasServicio || updatedDescargo.lineasProducto) {
            console.log("Líneas cargadas:", {
              servicios: updatedDescargo.lineasServicio?.length || 0,
              productos: updatedDescargo.lineasProducto?.length || 0
            })
          }
        } catch (error) {
          console.error("Error al cargar detalles del descargo:", error)
        }
      }
      
      fetchDescargoDetails()
    }
  }, [descargo.id])

  const loadServicios = async () => {
    setIsLoadingServicios(true)
    try {
      const data = await ServicioService.getAll()
      setServicios(data)
    } catch (error) {
      console.error("Error al cargar servicios:", error)
    } finally {
      setIsLoadingServicios(false)
    }
  }

  const loadProductos = async () => {
    setIsLoadingProductos(true)
    try {
      const data = await ProductoService.getAll()
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
    } finally {
      setIsLoadingProductos(false)
    }
  }

  const handleAddLineaServicio = async () => {
    if (!lineaServicioForm.servicioId || lineaServicioForm.cantidad <= 0) {
      toast.error("Error", {
        description: "Debe seleccionar un servicio y especificar una cantidad válida",
      })
      return
    }

    setIsAddingLinea(true)
    try {
      await DescargoService.addLineaServicio(descargo.id!, lineaServicioForm)
      setLineaServicioForm({ servicioId: 0, cantidad: 1 })
      onUpdate()
      toast.success("Éxito", {
        description: "Línea de servicio agregada correctamente",
      })
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo agregar la línea de servicio",
      })
    } finally {
      setIsAddingLinea(false)
    }
  }

  const handleAddLineaProducto = async () => {
    if (!lineaProductoForm.productoId || lineaProductoForm.cantidad <= 0) {
      toast.error("Error", {
        description: "Debe seleccionar un producto y especificar una cantidad válida",
      })
      return
    }

    setIsAddingLinea(true)
    try {
      await DescargoService.addLineaProducto(descargo.id!, lineaProductoForm)
      setLineaProductoForm({ productoId: 0, cantidad: 1 })
      onUpdate()
      toast.success("Éxito", {
        description: "Línea de producto agregada correctamente",
      })
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo agregar la línea de producto",
      })
    } finally {
      setIsAddingLinea(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calcularTotal = () => {
    const totalServicios = (descargo.lineasServicio || []).reduce((sum, linea) => sum + linea.subtotal, 0)
    const totalProductos = (descargo.lineasProducto || []).reduce((sum, linea) => sum + linea.subtotal, 0)
    return totalServicios + totalProductos
  }

  return (
    <div className="space-y-6">
      {/* Resumen del descargo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Descargo #{descargo.nro}</span>
            <Badge variant="outline">{formatPrice(calcularTotal())}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Paciente:</span>
              <p className="font-medium">{descargo.paciente?.nombre}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Documento:</span>
              <p className="font-medium">{descargo.paciente?.documentoIdentidad}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Líneas de Servicio:</span>
              <p className="font-medium">{descargo.lineasServicio?.length || 0}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Líneas de Producto:</span>
              <p className="font-medium">{descargo.lineasProducto?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agregar líneas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Líneas al Descargo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="servicios" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="servicios" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Servicios
              </TabsTrigger>
              <TabsTrigger value="productos" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="servicios" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Servicio</Label>
                  <Select
                    value={lineaServicioForm.servicioId.toString()}
                    onValueChange={(value) =>
                      setLineaServicioForm((prev) => ({ ...prev, servicioId: Number.parseInt(value) }))
                    }
                    disabled={isLoadingServicios}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingServicios ? "Cargando..." : "Seleccionar servicio"} />
                    </SelectTrigger>
                    <SelectContent>
                      {servicios.map((servicio) => (
                        <SelectItem key={servicio.id} value={servicio.id!.toString()}>
                          <div className="flex flex-col">
                            <span>{servicio.descripcion}</span>
                            <span className="text-sm text-muted-foreground">{formatPrice(servicio.precio)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      value={lineaServicioForm.cantidad}
                      onChange={(e) =>
                        setLineaServicioForm((prev) => ({ ...prev, cantidad: Number.parseInt(e.target.value) || 1 }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleAddLineaServicio} disabled={isAddingLinea} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Servicio
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="productos" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Producto</Label>
                  <Select
                    value={lineaProductoForm.productoId.toString()}
                    onValueChange={(value) =>
                      setLineaProductoForm((prev) => ({ ...prev, productoId: Number.parseInt(value) }))
                    }
                    disabled={isLoadingProductos}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingProductos ? "Cargando..." : "Seleccionar producto"} />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id!.toString()}>
                          <div className="flex flex-col">
                            <span>{producto.descripcion}</span>
                            <span className="text-sm text-muted-foreground">{formatPrice(producto.precio)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      value={lineaProductoForm.cantidad}
                      onChange={(e) =>
                        setLineaProductoForm((prev) => ({ ...prev, cantidad: Number.parseInt(e.target.value) || 1 }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleAddLineaProducto} disabled={isAddingLinea} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Producto
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lista de líneas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Líneas de Servicios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Servicios ({descargo.lineasServicio?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!descargo.lineasServicio || descargo.lineasServicio.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No hay servicios agregados</p>
            ) : (
              <div className="space-y-2">
                {descargo.lineasServicio.map((linea, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{linea.servicio?.descripcion}</p>
                      <p className="text-sm text-muted-foreground">
                        {linea.cantidad} x {formatPrice(linea.precioUnitario)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(linea.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Líneas de Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos ({descargo.lineasProducto?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!descargo.lineasProducto || descargo.lineasProducto.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No hay productos agregados</p>
            ) : (
              <div className="space-y-2">
                {descargo.lineasProducto.map((linea, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{linea.producto?.descripcion}</p>
                      <p className="text-sm text-muted-foreground">
                        {linea.cantidad} x {formatPrice(linea.precioUnitario)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(linea.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Total */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total del Descargo:</span>
            <span className="text-green-600">{formatPrice(calcularTotal())}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}