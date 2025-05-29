"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import {
  Loader2,
  DollarSign,
  Pill,
  UtensilsCrossed,
  Building,
  CalendarIcon,
  Hash,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../../lib/utils";
import type {
  Producto,
  ProductoFormData,
  ProductoTipo,
} from "../../app/types/producto";
import { PRODUCTO_TIPOS } from "../../app/types/producto";

interface ProductoFormProps {
  producto?: Producto;
  onSubmit: (data: ProductoFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductoForm({
  producto,
  onSubmit,
  onCancel,
  isLoading,
}: ProductoFormProps) {
  const [formData, setFormData] = useState<ProductoFormData>({
    descripcion: producto?.descripcion || "",
    precio: producto?.precio || 0,
    productoTipo: producto?.productoTipo || "MEDICINA",
    laboratorio:
      producto?.productoTipo === "MEDICINA"
        ? (producto as any).laboratorio || ""
        : "",
    dosis:
      producto?.productoTipo === "MEDICINA"
        ? (producto as any).dosis || ""
        : "",
    valorNutricional:
      producto?.productoTipo === "COMIDA"
        ? (producto as any).valorNutricional || ""
        : "",
    tipoComida:
      producto?.productoTipo === "COMIDA"
        ? (producto as any).tipoComida || ""
        : "",
    numeroHabitacion:
      producto?.productoTipo === "CUARTO_HOSPITAL"
        ? (producto as any).numeroHabitacion || ""
        : "",
    fechaCheckIn:
      producto?.productoTipo === "CUARTO_HOSPITAL"
        ? (producto as any).fechaCheckIn || ""
        : "",
    fechaCheckOut:
      producto?.productoTipo === "CUARTO_HOSPITAL"
        ? (producto as any).fechaCheckOut || ""
        : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    formData.fechaCheckIn ? new Date(formData.fechaCheckIn) : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    formData.fechaCheckOut ? new Date(formData.fechaCheckOut) : undefined
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      laboratorio:
        prev.productoTipo === "MEDICINA" ? prev.laboratorio || "" : "",
      dosis: prev.productoTipo === "MEDICINA" ? prev.dosis || "" : "",
      valorNutricional:
        prev.productoTipo === "COMIDA" ? prev.valorNutricional || "" : "",
      tipoComida: prev.productoTipo === "COMIDA" ? prev.tipoComida || "" : "",
      numeroHabitacion:
        prev.productoTipo === "CUARTO_HOSPITAL"
          ? prev.numeroHabitacion || ""
          : "",
      fechaCheckIn:
        prev.productoTipo === "CUARTO_HOSPITAL" ? prev.fechaCheckIn || "" : "",
      fechaCheckOut:
        prev.productoTipo === "CUARTO_HOSPITAL" ? prev.fechaCheckOut || "" : "",
    }));
  }, [formData.productoTipo]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.productoTipo) {
      newErrors.productoTipo = "El tipo de producto es requerido";
    }

    switch (formData.productoTipo) {
      case "MEDICINA":
        if (!formData.laboratorio) {
          newErrors.laboratorio = "El laboratorio es requerido";
        }
        if (!formData.dosis) {
          newErrors.dosis = "La dosis es requerida";
        }
        break;
      case "COMIDA":
        if (!formData.valorNutricional) {
          newErrors.valorNutricional = "El valor nutricional es requerido";
        }
        if (!formData.tipoComida) {
          newErrors.tipoComida = "El tipo de comida es requerido";
        }
        break;
      case "CUARTO_HOSPITAL":
        if (!formData.numeroHabitacion) {
          newErrors.numeroHabitacion = "El número de habitación es requerido";
        }
        if (!formData.fechaCheckIn) {
          newErrors.fechaCheckIn = "La fecha de check-in es requerida";
        }
        if (!formData.fechaCheckOut) {
          newErrors.fechaCheckOut = "La fecha de check-out es requerida";
        }
        if (
          formData.fechaCheckIn &&
          formData.fechaCheckOut &&
          formData.fechaCheckIn >= formData.fechaCheckOut
        ) {
          newErrors.fechaCheckOut =
            "La fecha de check-out debe ser posterior al check-in";
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
      const dataToSubmit: ProductoFormData = {
        descripcion: formData.descripcion,
        precio: formData.precio,
        productoTipo: formData.productoTipo,
      };

      switch (formData.productoTipo) {
        case "MEDICINA":
          dataToSubmit.laboratorio = formData.laboratorio;
          dataToSubmit.dosis = formData.dosis;
          break;
        case "COMIDA":
          dataToSubmit.valorNutricional = formData.valorNutricional;
          dataToSubmit.tipoComida = formData.tipoComida;
          break;
        case "CUARTO_HOSPITAL":
          dataToSubmit.numeroHabitacion = formData.numeroHabitacion;
          dataToSubmit.fechaCheckIn = formData.fechaCheckIn;
          dataToSubmit.fechaCheckOut = formData.fechaCheckOut;
          break;
      }

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, precio: value }));
  };

  const handleTipoChange = (value: ProductoTipo) => {
    setFormData((prev) => ({ ...prev, productoTipo: value }));
  };

  const handleCheckInDateSelect = (selectedDate: Date | undefined) => {
    setCheckInDate(selectedDate);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        fechaCheckIn: selectedDate.toISOString().split("T")[0],
      }));
    }
  };

  const handleCheckOutDateSelect = (selectedDate: Date | undefined) => {
    setCheckOutDate(selectedDate);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        fechaCheckOut: selectedDate.toISOString().split("T")[0],
      }));
    }
  };

  const selectedTipoLabel = PRODUCTO_TIPOS.find(
    (tipo) => tipo.value === formData.productoTipo
  )?.label;

  const renderSpecificFields = () => {
    switch (formData.productoTipo) {
      case "MEDICINA":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="laboratorio">Laboratorio</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="laboratorio"
                  value={formData.laboratorio}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      laboratorio: e.target.value,
                    }))
                  }
                  placeholder="Ej: Pfizer, Bayer, etc."
                  className={`pl-10 ${
                    errors.laboratorio ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.laboratorio && (
                <p className="text-sm text-red-500">{errors.laboratorio}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosis">Dosis</Label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dosis"
                  value={formData.dosis}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dosis: e.target.value }))
                  }
                  placeholder="Ej: 500mg, 1 tableta cada 8 horas"
                  className={`pl-10 ${errors.dosis ? "border-red-500" : ""}`}
                />
              </div>
              {errors.dosis && (
                <p className="text-sm text-red-500">{errors.dosis}</p>
              )}
            </div>
          </>
        );
      case "COMIDA":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="valorNutricional">Valor Nutricional</Label>
              <div className="relative">
                <UtensilsCrossed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="valorNutricional"
                  value={formData.valorNutricional}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      valorNutricional: e.target.value,
                    }))
                  }
                  placeholder="Ej: 250 kcal, Rico en proteínas"
                  className={`pl-10 ${
                    errors.valorNutricional ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.valorNutricional && (
                <p className="text-sm text-red-500">
                  {errors.valorNutricional}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoComida">Tipo de Comida</Label>
              <Select
                value={formData.tipoComida}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tipoComida: value }))
                }
              >
                <SelectTrigger
                  className={errors.tipoComida ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona el tipo de comida" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESAYUNO">Desayuno</SelectItem>
                  <SelectItem value="ALMUERZO">Almuerzo</SelectItem>
                  <SelectItem value="CENA">Cena</SelectItem>
                  <SelectItem value="SNACK">Snack</SelectItem>
                  <SelectItem value="DIETA_ESPECIAL">Dieta Especial</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoComida && (
                <p className="text-sm text-red-500">{errors.tipoComida}</p>
              )}
            </div>
          </>
        );
      case "CUARTO_HOSPITAL":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="numeroHabitacion">Número de Habitación</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="numeroHabitacion"
                  value={formData.numeroHabitacion}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      numeroHabitacion: e.target.value,
                    }))
                  }
                  placeholder="Ej: 101, A-205, etc."
                  className={`pl-10 ${
                    errors.numeroHabitacion ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.numeroHabitacion && (
                <p className="text-sm text-red-500">
                  {errors.numeroHabitacion}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha Check-In</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkInDate && "text-muted-foreground",
                        errors.fechaCheckIn && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate
                        ? format(checkInDate, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={handleCheckInDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.fechaCheckIn && (
                  <p className="text-sm text-red-500">{errors.fechaCheckIn}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Fecha Check-Out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground",
                        errors.fechaCheckOut && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate
                        ? format(checkOutDate, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={handleCheckOutDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.fechaCheckOut && (
                  <p className="text-sm text-red-500">{errors.fechaCheckOut}</p>
                )}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{producto ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productoTipo">Tipo de Producto</Label>
            <Select
              value={formData.productoTipo}
              onValueChange={handleTipoChange}
            >
              <SelectTrigger
                className={errors.productoTipo ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona el tipo de producto">
                  {selectedTipoLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PRODUCTO_TIPOS.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productoTipo && (
              <p className="text-sm text-red-500">{errors.productoTipo}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción del Producto</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
              placeholder="Describe el producto..."
              className={errors.descripcion ? "border-red-500" : ""}
              rows={3}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {renderSpecificFields()}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {producto ? "Actualizar" : "Crear"} Producto
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
