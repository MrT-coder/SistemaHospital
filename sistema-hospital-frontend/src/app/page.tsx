import Link from "next/link";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Users, FileText, Package, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Sistema Hospital</h1>
        <p className="text-muted-foreground">Sistema de gestión hospitalaria</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pacientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Gestión de pacientes del hospital
            </p>
            <Link href="/pacientes">
              <Button className="w-full">Gestionar Pacientes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Catálogo de servicios médicos
            </p>
            <Link href="/servicios">
              <Button className="w-full">Gestionar Servicios</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Catálogo de productos hospitalarios
            </p>
            <Link href="/productos">
              <Button className="w-full">Gestionar Productos</Button>
            </Link>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Descargos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Gestión de documentos de descargo</p>
            <Link href="/descargos">
              <Button className="w-full">Gestionar Descargos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
