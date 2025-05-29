"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { PacienteService } from "../../app/services/paciente-service"
import { Loader2, CheckCircle, XCircle, Info, Server, Globe } from "lucide-react"

export function ApiDebug() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testDirectConnection = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const fullUrl = `${apiUrl}/api/pacientes`

      console.log("🧪 Test directo de conexión...")
      console.log("🔗 URL completa:", fullUrl)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("📡 Respuesta:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (response.ok) {
        const data = await response.json()
        setResult({
          success: true,
          status: response.status,
          data: data,
          count: Array.isArray(data) ? data.length : "No es array",
          apiUrl: apiUrl,
          fullUrl: fullUrl,
          responseHeaders: Object.fromEntries(response.headers.entries()),
          method: "Fetch directo",
        })
      } else {
        const errorText = await response.text()
        setError(`Error HTTP ${response.status}: ${errorText}`)
      }
    } catch (err: any) {
      console.error("🚨 Error en test directo:", err)

      let errorMessage = `Error: ${err.message}`

      if (err.name === "AbortError") {
        errorMessage = "⏱️ Timeout: El servidor no responde después de 10 segundos"
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = `🚫 No se puede conectar al servidor:

Posibles causas:
• El backend Spring Boot no está ejecutándose
• URL incorrecta: ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
• Problema de CORS en el backend
• Firewall bloqueando la conexión
• El servidor está en una red diferente

Soluciones:
1. Verifica que Spring Boot esté corriendo en el puerto correcto
2. Accede directamente a: ${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/pacientes"}
3. Configura CORS en tu backend Spring Boot`
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const testWithService = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      console.log("🧪 Test con PacienteService...")
      const data = await PacienteService.getAll()
      setResult({
        success: true,
        data: data,
        count: data.length,
        method: "PacienteService.getAll()",
      })
    } catch (err: any) {
      console.error("🚨 Error en PacienteService:", err)
      setError(`Error en PacienteService: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testBackendHealth = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

      // Test basic connectivity to root
      const healthUrl = `${apiUrl}/actuator/health`
      console.log("🏥 Probando health check:", healthUrl)

      const response = await fetch(healthUrl, {
        method: "GET",
        mode: "cors",
      })

      if (response.ok) {
        const data = await response.json()
        setResult({
          success: true,
          status: response.status,
          data: data,
          method: "Health Check",
          message: "Backend está funcionando correctamente",
        })
      } else {
        // Try root endpoint
        const rootResponse = await fetch(apiUrl, {
          method: "GET",
          mode: "cors",
        })

        setResult({
          success: rootResponse.ok,
          status: rootResponse.status,
          method: "Root endpoint test",
          message: rootResponse.ok ? "Servidor responde" : "Servidor no responde correctamente",
        })
      }
    } catch (err: any) {
      setError(`Error en health check: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Diagnóstico de Conexión Backend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div>
                <strong>URL Backend:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
              </div>
              <div>
                <strong>Endpoint Pacientes:</strong>{" "}
                {(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/pacientes"}
              </div>
              <div>
                <strong>Entorno:</strong> {process.env.NODE_ENV || "development"}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={testDirectConnection} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
            Test Directo
          </Button>
          <Button onClick={testWithService} disabled={isLoading} variant="outline">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Server className="mr-2 h-4 w-4" />}
            Test Servicio
          </Button>
          <Button onClick={testBackendHealth} disabled={isLoading} variant="secondary">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Health Check
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="whitespace-pre-line">
                <strong>Error:</strong> {error}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">Status: {result.status || "OK"}</Badge>
                  {result.count !== undefined && <Badge variant="outline">Registros: {result.count}</Badge>}
                  {result.method && <Badge variant="outline">Método: {result.method}</Badge>}
                </div>
                {result.message && <div className="text-sm font-medium text-green-600">{result.message}</div>}
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">Ver respuesta completa</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-60">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
