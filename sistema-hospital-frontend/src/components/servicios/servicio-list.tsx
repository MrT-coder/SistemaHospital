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
  Clock,
  User,
  FlaskRoundIcon as Flask,
  Activity,
  Scan,
} from "lucide-react"
import type { Servicio, ServicioTipo } from "../../app/types/servicio"
import { SERVICIO_TIPOS } from "../../app/types/servicio"

interface ServicioListProps {
  servicios: Servicio[]
  onEdit: (servicio: Servicio) => void
  onDelete: (id: number) => void
  onAdd: () => void
  isLoading?: boolean
}

export function ServicioList({ servicios, onEdit, onDelete, onAdd, isLoading }: ServicioListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<ServicioTipo | "ALL">("ALL")

  const filteredServicios = servicios.filter((servicio) => {
    const matchesSearch = servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === "ALL" || servicio.servicioTipo === tipoFilter
    return matchesSearch && matchesTipo
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTipoLabel = (tipo: ServicioTipo) => {
    return SERVICIO_TIPOS.find((t) => t.value === tipo)?.label || tipo
  }

  const getTipoBadgeVariant = (tipo: ServicioTipo) => {
    switch (tipo) {
      case "ATENCION_MEDICA":
        return "default"
      case "EXAMEN_LAB":
        return "secondary"
      case "IMAGEN_RAYOS_X":
        return "outline"
      case "PROCEDIMIENTO_MEDICO":
        return "destructive"
      default:
        return "default"
    }
  }

  // Renderizar detalles específicos según el tipo de servicio
  const renderSpecificDetails = (servicio: Servicio) => {
    switch (servicio.servicioTipo) {
      case "ATENCION_MEDICA":
        const atencion = servicio as any
        return (
          <div className="flex flex-col text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Duración: {atencion.duracion}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Médico: {atencion.medico}</span>
            </div>
          </div>
        )
      case "EXAMEN_LAB":
        const examen = servicio as any
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Flask className="h-3 w-3" />
            <span>Tipo: {examen.tipoExamen}</span>
          </div>
        )
      case "IMAGEN_RAYOS_X":
        const imagen = servicio as any
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Scan className="h-3 w-3" />
            <span>Región: {imagen.region}</span>
          </div>
        )
      case "PROCEDIMIENTO_MEDICO":
        const procedimiento = servicio as any
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Activity className="h-3 w-3" />
            <span>Procedimiento: {procedimiento.nombreProcedimiento}</span>
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
              Gestión de Servicios
            </CardTitle>
            <Button onClick={onAdd} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Servicio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={tipoFilter} onValueChange={(value: ServicioTipo | "ALL") => setTipoFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los tipos</SelectItem>
                  {SERVICIO_TIPOS.map((tipo) => (
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
              <p className="text-muted-foreground">Cargando servicios...</p>
            </div>
          ) : filteredServicios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || tipoFilter !== "ALL"
                  ? "No se encontraron servicios que coincidan con los filtros."
                  : "No hay servicios registrados."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServicios.map((servicio) => (
                    <TableRow key={servicio.id}>
                      <TableCell>
                        <Badge variant={getTipoBadgeVariant(servicio.servicioTipo)}>
                          {getTipoLabel(servicio.servicioTipo)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-xs">
                          <p className="truncate">{servicio.descripcion}</p>
                          {renderSpecificDetails(servicio)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {formatPrice(servicio.precio)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(servicio)}>
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
                                <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el servicio{" "}
                                  <strong>{servicio.descripcion}</strong> del sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => servicio.id && onDelete(servicio.id)}
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

          {filteredServicios.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {filteredServicios.length} de {servicios.length} servicios
              {tipoFilter !== "ALL" && ` (filtrado por: ${getTipoLabel(tipoFilter as ServicioTipo)})`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
