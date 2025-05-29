"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DescargoList } from "../../components/descargos/descargo-list";
import { DescargoForm } from "../../components/descargos/descargo-form";
import { DescargoLineas } from "../../components/descargos/descargo-lineas";
import { DescargoService } from "../services/descargo-service";
//import { DocumentoService } from "../services/documento-service";
import type {
  Descargo,
  DescargoFormData,
  DescargoUpdateData,
} from "../types/descargo";
import { toast } from "sonner";
import {
  ArrowLeft,
  Server,
  AlertTriangle,
  RefreshCw,
  Eye,
  Edit,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

type ViewMode = "list" | "create" | "edit" | "view";

export default function DescargosPage() {
  const router = useRouter();
  const [descargos, setDescargos] = useState<Descargo[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDescargo, setSelectedDescargo] = useState<
    Descargo | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    loadDescargos();
  }, []);

  const loadDescargos = async () => {
    setIsLoading(true);
    setConnectionError(null);

    try {
      console.log("🔄 Intentando cargar descargos...");
      const data = await DescargoService.getAll();
      console.log("✅ Descargos cargados exitosamente:", data.length);
      setDescargos(data);

      toast.success("Conexión Exitosa", {
        description: `Se cargaron ${data.length} descargos desde el backend`,
      });
    } catch (error: any) {
      console.error("❌ Error al cargar descargos:", error);
      setConnectionError(error.message);

      toast.error("Error de Conexión", {
        description: "No se pudo conectar al backend de descargos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDescargoDetails = async (id: number) => {
    try {
      const descargo = await DescargoService.getById(id);
      setSelectedDescargo(descargo);
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.message || "No se pudo cargar los detalles del descargo",
      });
    }
  };

  const handleCreate = () => {
    setSelectedDescargo(undefined);
    setViewMode("create");
  };

  const handleEdit = (descargo: Descargo) => {
    setSelectedDescargo(descargo);
    setViewMode("edit");
  };

  const handleView = async (descargo: Descargo) => {
    await loadDescargoDetails(descargo.id!);
    setViewMode("view");
  };

  const handleDelete = async (id: number) => {
    try {
      await DescargoService.delete(id);
      setDescargos((prev) => prev.filter((d) => d.id !== id));
      toast.success("Éxito", {
        description: "Descargo eliminado correctamente",
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo eliminar el descargo",
      });
    }
  };

  const handleSubmit = async (data: DescargoFormData) => {
    setIsFormLoading(true);
    try {
      if (viewMode === "create") {
        const newDescargo = await DescargoService.create(data);
        setDescargos((prev) => [...prev, newDescargo]);
        toast.success("Éxito", {
          description: "Descargo creado correctamente",
        });
        // Después de crear, ir a la vista de detalles para agregar líneas
        await loadDescargoDetails(newDescargo.id!);
        setViewMode("view");
      } else if (viewMode === "edit" && selectedDescargo?.id) {
        const updateData: DescargoUpdateData = {
          nro: data.nro,
          fecha: data.fecha,
          pacienteId: data.pacienteId,
        };
        const updatedDescargo = await DescargoService.update(
          selectedDescargo.id,
          updateData
        );
        setDescargos((prev) =>
          prev.map((d) => (d.id === selectedDescargo.id ? updatedDescargo : d))
        );
        toast.success("Éxito", {
          description: "Descargo actualizado correctamente",
        });
        setViewMode("list");
        setSelectedDescargo(undefined);
      }
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.message ||
          `No se pudo ${
            viewMode === "create" ? "crear" : "actualizar"
          } el descargo`,
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedDescargo(undefined);
  };

  const handleUpdateDescargo = async () => {
    if (selectedDescargo?.id) {
      await loadDescargoDetails(selectedDescargo.id);
      // También actualizar la lista
      await loadDescargos();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "secondary";
      case "DESCARGADO":
        return "default";
      case "FACTURADO":
        return "outline";
      default:
        return "secondary";
    }
  };

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
              <div className="text-sm bg-destructive/10 p-2 rounded">
                {connectionError}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDescargos}
                  disabled={isLoading}
                >
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
              <strong>Backend Conectado:</strong>{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
              /api/descargos
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Contenido principal */}
      {viewMode === "list" ? (
        <DescargoList
          descargos={descargos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleCreate}
          onView={handleView}
          isLoading={isLoading}
        />
      ) : viewMode === "view" && selectedDescargo ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleCancel}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setViewMode("edit")}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Descargo
              </Button>
            </div>
          </div>

          {/* Header del descargo */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Descargo #{selectedDescargo.nro}
                </CardTitle>
                <Badge
                  variant={getEstadoBadgeVariant(selectedDescargo.estado!)}
                >
                  {selectedDescargo.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Paciente:
                  </span>
                  <p className="font-medium">
                    {selectedDescargo.paciente?.nombre}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Documento:
                  </span>
                  <p className="font-medium">
                    {selectedDescargo.paciente?.documentoIdentidad}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Fecha:</span>
                  <p className="font-medium">
                    {new Date(selectedDescargo.fecha).toLocaleDateString(
                      "es-CO"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <p className="font-medium text-green-600">
                    {formatPrice(selectedDescargo.valorTotal)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gestión de líneas */}
          <DescargoLineas
            descargo={selectedDescargo}
            onUpdate={handleUpdateDescargo}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Button variant="outline" onClick={handleCancel} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Button>
          <DescargoForm
            descargo={selectedDescargo}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isFormLoading}
          />
        </div>
      )}
    </div>
  );
}
