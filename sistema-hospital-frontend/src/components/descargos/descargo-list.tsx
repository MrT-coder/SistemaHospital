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
import { Edit, Trash2, Search, Plus, DollarSign, Filter, Eye, User, Calendar, FileText } from "lucide-react"
import type { Descargo, EstadoDocumento } from "../../app/types/descargo"
import { ESTADOS_DOCUMENTO } from "../../app/types/descargo"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface DescargoListProps {
  descargos: Descargo[]
  onEdit: (descargo: Descargo) => void
  onDelete: (id: number) => void
  onAdd: () => void
  onView: (descargo: Descargo) => void
  isLoading?: boolean
}

export function DescargoList({ descargos, onEdit, onDelete, onAdd, onView, isLoading }: DescargoListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<EstadoDocumento | "ALL">("ALL")

  const filteredDescargos = descargos.filter((descargo) => {
    const matchesSearch =
      descargo.nro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      descargo.paciente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      descargo.paciente?.documentoIdentidad.includes(searchTerm)
    const matchesEstado = estadoFilter === "ALL" || descargo.estado === estadoFilter
    return matchesSearch && matchesEstado
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es })
    } catch {
      return dateString
    }
  }

  const getEstadoBadgeVariant = (estado: EstadoDocumento) => {
    switch (estado) {
      case "PENDIENTE":
        return "secondary"
      case "DESCARGADO":
        return "default"
      case "FACTURADO":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getEstadoLabel = (estado: EstadoDocumento) => {
    return ESTADOS_DOCUMENTO.find((e) => e.value === estado)?.label || estado
  }

  const getTotalLineas = (descargo: Descargo) => {
    return descargo.lineas?.length || 0
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gestión de Descargos
            </CardTitle>
            <Button onClick={onAdd} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Descargo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, paciente o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={estadoFilter} onValueChange={(value: EstadoDocumento | "ALL") => setEstadoFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  {ESTADOS_DOCUMENTO.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando descargos...</p>
            </div>
          ) : filteredDescargos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || estadoFilter !== "ALL"
                  ? "No se encontraron descargos que coincidan con los filtros."
                  : "No hay descargos registrados."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Líneas</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDescargos.map((descargo) => (
                    <TableRow key={descargo.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {descargo.nro}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{descargo.paciente?.nombre}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{descargo.paciente?.documentoIdentidad}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDateTime(descargo.fecha)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(descargo.estado!)}>
                          {getEstadoLabel(descargo.estado!)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <Badge variant="outline">{getTotalLineas(descargo)}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {formatPrice(descargo.valorTotal)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => onView(descargo)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onEdit(descargo)}>
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
                                <AlertDialogTitle>¿Eliminar descargo?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el descargo{" "}
                                  <strong>{descargo.nro}</strong> y todas sus líneas asociadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => descargo.id && onDelete(descargo.id)}
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

          {filteredDescargos.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {filteredDescargos.length} de {descargos.length} descargos
              {estadoFilter !== "ALL" && ` (filtrado por: ${getEstadoLabel(estadoFilter as EstadoDocumento)})`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
