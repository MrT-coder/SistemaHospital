"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import {
  Edit,
  Trash2,
  Search,
  Plus,
  DollarSign,
  Filter,
  Pill,
  UtensilsCrossed,
  Building,
  Hash,
  Calendar,
} from "lucide-react"
import type { Producto, ProductoTipo } from "../../app/types/producto"
import { PRODUCTO_TIPOS } from "../../app/types/producto"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ProductoListProps {
  productos: Producto[]
  onEdit: (producto: Producto) => void
  onDelete: (id: number) => void
  onAdd: () => void
  isLoading?: boolean
}

export function ProductoList({ productos, onEdit, onDelete, onAdd, isLoading }: ProductoListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<ProductoTipo | "ALL">("ALL")

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === "ALL" || producto.productoTipo === tipoFilter
    return matchesSearch && matchesTipo
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es })
    } catch {
      return dateString
    }
  }

  const getTipoLabel = (tipo: ProductoTipo) => {
    return PRODUCTO_TIPOS.find((t) => t.value === tipo)?.label || tipo
  }

  const getTipoBadgeVariant = (tipo: ProductoTipo) => {
    switch (tipo) {
      case "MEDICINA":
        return "default"
      case "COMIDA":
        return "secondary"
      case "CUARTO_HOSPITAL":
        return "outline"
      default:
        return "default"
    }
  }

  // Renderizar detalles específicos según el tipo de producto
  const renderSpecificDetails = (producto: Producto) => {
    switch (producto.productoTipo) {
      case "MEDICINA":
        const medicina = producto as any
        return (
          <div className="flex flex-col text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              <span>Lab: {medicina.laboratorio}</span>
            </div>
            <div className="flex items-center gap-1">
              <Pill className="h-3 w-3" />
              <span>Dosis: {medicina.dosis}</span>
            </div>
          </div>
        )
      case "COMIDA":
        const comida = producto as any
        return (
          <div className="flex flex-col text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <UtensilsCrossed className="h-3 w-3" />
              <span>Tipo: {comida.tipoComida}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Nutricional: {comida.valorNutricional}</span>
            </div>
          </div>
        )
      case "CUARTO_HOSPITAL":
        const cuarto = producto as any
        return (
          <div className="flex flex-col text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              <span>Habitación: {cuarto.numeroHabitacion}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDate(cuarto.fechaCheckIn)} - {formatDate(cuarto.fechaCheckOut)}
              </span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Gestión de Productos
            </CardTitle>
            <Button onClick={onAdd} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={tipoFilter} onValueChange={(value: ProductoTipo | "ALL") => setTipoFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los tipos</SelectItem>
                  {PRODUCTO_TIPOS.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || tipoFilter !== "ALL"
                  ? "No se encontraron productos que coincidan con los filtros."
                  : "No hay productos registrados."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProductos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <Badge variant={getTipoBadgeVariant(producto.productoTipo)}>
                          {getTipoLabel(producto.productoTipo)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-xs">
                          <p className="truncate">{producto.descripcion}</p>
                          {renderSpecificDetails(producto)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{producto.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {formatPrice(producto.precio)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(producto)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el producto{" "}
                                  <strong>{producto.descripcion}</strong> del sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => producto.id && onDelete(producto.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredProductos.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {filteredProductos.length} de {productos.length} productos
              {tipoFilter !== "ALL" && ` (filtrado por: ${getTipoLabel(tipoFilter as ProductoTipo)})`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
