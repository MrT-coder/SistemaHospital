"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Loader2, DollarSign, Clock, User, Scan, Activity, TestTube} from "lucide-react";
import type {
  Servicio,
  ServicioFormData,
  ServicioTipo,
} from "../../app/types/servicio";
import { SERVICIO_TIPOS } from "../../app/types/servicio";

interface ServicioFormProps {
  servicio?: Servicio;
  onSubmit: (data: ServicioFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ServicioForm({
  servicio,
  onSubmit,
  onCancel,
  isLoading,
}: ServicioFormProps) {
  const [formData, setFormData] = useState<ServicioFormData>({
    descripcion: servicio?.descripcion || "",
    precio: servicio?.precio || 0,
    servicioTipo: servicio?.servicioTipo || "ATENCION_MEDICA",
    duracion:
      servicio?.servicioTipo === "ATENCION_MEDICA"
        ? (servicio as any).duracion || ""
        : "",
    medico:
      servicio?.servicioTipo === "ATENCION_MEDICA"
        ? (servicio as any).medico || ""
        : "",
    tipoExamen:
      servicio?.servicioTipo === "EXAMEN_LAB"
        ? (servicio as any).tipoExamen || ""
        : "",
    region:
      servicio?.servicioTipo === "IMAGEN_RAYOS_X"
        ? (servicio as any).region || ""
        : "",
    nombreProcedimiento:
      servicio?.servicioTipo === "PROCEDIMIENTO_MEDICO"
        ? (servicio as any).nombreProcedimiento || ""
        : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      duracion:
        prev.servicioTipo === "ATENCION_MEDICA" ? prev.duracion || "" : "",
      medico: prev.servicioTipo === "ATENCION_MEDICA" ? prev.medico || "" : "",
      tipoExamen:
        prev.servicioTipo === "EXAMEN_LAB" ? prev.tipoExamen || "" : "",
      region: prev.servicioTipo === "IMAGEN_RAYOS_X" ? prev.region || "" : "",
      nombreProcedimiento:
        prev.servicioTipo === "PROCEDIMIENTO_MEDICO"
          ? prev.nombreProcedimiento || ""
          : "",
    }));
  }, [formData.servicioTipo]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.servicioTipo) {
      newErrors.servicioTipo = "El tipo de servicio es requerido";
    }

    switch (formData.servicioTipo) {
      case "ATENCION_MEDICA":
        if (!formData.duracion) {
          newErrors.duracion = "La duración es requerida";
        }
        if (!formData.medico) {
          newErrors.medico = "El médico es requerido";
        }
        break;
      case "EXAMEN_LAB":
        if (!formData.tipoExamen) {
          newErrors.tipoExamen = "El tipo de examen es requerido";
        }
        break;
      case "IMAGEN_RAYOS_X":
        if (!formData.region) {
          newErrors.region = "La región es requerida";
        }
        break;
      case "PROCEDIMIENTO_MEDICO":
        if (!formData.nombreProcedimiento) {
          newErrors.nombreProcedimiento =
            "El nombre del procedimiento es requerido";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const dataToSubmit: ServicioFormData = {
        descripcion: formData.descripcion,
        precio: formData.precio,
        servicioTipo: formData.servicioTipo,
      };

      switch (formData.servicioTipo) {
        case "ATENCION_MEDICA":
          dataToSubmit.duracion = formData.duracion;
          dataToSubmit.medico = formData.medico;
          break;
        case "EXAMEN_LAB":
          dataToSubmit.tipoExamen = formData.tipoExamen;
          break;
        case "IMAGEN_RAYOS_X":
          dataToSubmit.region = formData.region;
          break;
        case "PROCEDIMIENTO_MEDICO":
          dataToSubmit.nombreProcedimiento = formData.nombreProcedimiento;
          break;
      }

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Error al guardar servicio:", error);
    }
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, precio: value }));
  };

  const handleTipoChange = (value: ServicioTipo) => {
    setFormData((prev) => ({ ...prev, servicioTipo: value }));
  };

  const selectedTipoLabel = SERVICIO_TIPOS.find(
    (tipo) => tipo.value === formData.servicioTipo
  )?.label;

  const renderSpecificFields = () => {
    switch (formData.servicioTipo) {
      case "ATENCION_MEDICA":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="duracion">Duración (HH:MM)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="duracion"
                  value={formData.duracion}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duracion: e.target.value,
                    }))
                  }
                  placeholder="01:00"
                  className={`pl-10 ${errors.duracion ? "border-red-500" : ""}`}
                />
              </div>
              {errors.duracion && (
                <p className="text-sm text-red-500">{errors.duracion}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="medico">Médico</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="medico"
                  value={formData.medico}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, medico: e.target.value }))
                  }
                  placeholder="Dr. Nombre Apellido"
                  className={`pl-10 ${errors.medico ? "border-red-500" : ""}`}
                />
              </div>
              {errors.medico && (
                <p className="text-sm text-red-500">{errors.medico}</p>
              )}
            </div>
          </>
        );
      case "EXAMEN_LAB":
        return (
          <div className="space-y-2">
            <Label htmlFor="tipoExamen">Tipo de Examen</Label>
            <div className="relative">
              <TestTube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="tipoExamen"
                value={formData.tipoExamen}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tipoExamen: e.target.value,
                  }))
                }
                placeholder="Ej: Hemograma, Glucosa, etc."
                className={`pl-10 ${errors.tipoExamen ? "border-red-500" : ""}`}
              />
            </div>
            {errors.tipoExamen && (
              <p className="text-sm text-red-500">{errors.tipoExamen}</p>
            )}
          </div>
        );
      case "IMAGEN_RAYOS_X":
        return (
          <div className="space-y-2">
            <Label htmlFor="region">Región del Cuerpo</Label>
            <div className="relative">
              <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="region"
                value={formData.region}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, region: e.target.value }))
                }
                placeholder="Ej: Tórax, Cráneo, etc."
                className={`pl-10 ${errors.region ? "border-red-500" : ""}`}
              />
            </div>
            {errors.region && (
              <p className="text-sm text-red-500">{errors.region}</p>
            )}
          </div>
        );
      case "PROCEDIMIENTO_MEDICO":
        return (
          <div className="space-y-2">
            <Label htmlFor="nombreProcedimiento">
              Nombre del Procedimiento
            </Label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="nombreProcedimiento"
                value={formData.nombreProcedimiento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nombreProcedimiento: e.target.value,
                  }))
                }
                placeholder="Ej: Cirugía, Sutura, etc."
                className={`pl-10 ${
                  errors.nombreProcedimiento ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.nombreProcedimiento && (
              <p className="text-sm text-red-500">
                {errors.nombreProcedimiento}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{servicio ? "Editar Servicio" : "Nuevo Servicio"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="servicioTipo">Tipo de Servicio</Label>
            <Select
              value={formData.servicioTipo}
              onValueChange={handleTipoChange}
            >
              <SelectTrigger
                className={errors.servicioTipo ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona el tipo de servicio">
                  {selectedTipoLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SERVICIO_TIPOS.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.servicioTipo && (
              <p className="text-sm text-red-500">{errors.servicioTipo}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción del Servicio</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
              placeholder="Describe el servicio médico..."
              className={errors.descripcion ? "border-red-500" : ""}
              rows={3}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio">Precio</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={handlePrecioChange}
                placeholder="0.00"
                className={`pl-10 ${errors.precio ? "border-red-500" : ""}`}
              />
            </div>
            {errors.precio && (
              <p className="text-sm text-red-500">{errors.precio}</p>
            )}
          </div>

          {renderSpecificFields()}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {servicio ? "Actualizar" : "Crear"} Servicio
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
