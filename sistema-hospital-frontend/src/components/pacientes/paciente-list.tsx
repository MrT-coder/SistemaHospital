"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
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
import { Edit, Trash2, Search, UserPlus, Phone, MapPin, Calendar } from "lucide-react"
import type { Paciente } from "../../app/types/paciente"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PacienteListProps {
  pacientes: Paciente[]
  onEdit: (paciente: Paciente) => void
  onDelete: (id: number) => void
  onAdd: () => void
  isLoading?: boolean
}

export function PacienteList({ pacientes, onEdit, onDelete, onAdd, isLoading }: PacienteListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.documentoIdentidad.includes(searchTerm) ||
      paciente.telefono.includes(searchTerm),
  )

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es })
    } catch {
      return dateString
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Gestión de Pacientes
            </CardTitle>
            <Button onClick={onAdd} className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Paciente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, documento o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando pacientes...</p>
            </div>
          ) : filteredPacientes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No se encontraron pacientes que coincidan con la búsqueda."
                  : "No hay pacientes registrados."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPacientes.map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{paciente.nombre}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(paciente.fechaNacimiento)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{paciente.documentoIdentidad}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{calculateAge(paciente.fechaNacimiento)} años</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {paciente.telefono}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 max-w-xs">
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{paciente.direccion}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(paciente)}>
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
                                <AlertDialogTitle>¿Eliminar paciente?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el paciente{" "}
                                  <strong>{paciente.nombre}</strong> del sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => paciente.id && onDelete(paciente.id)}
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

          {filteredPacientes.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {filteredPacientes.length} de {pacientes.length} pacientes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
