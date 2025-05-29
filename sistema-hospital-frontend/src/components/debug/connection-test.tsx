"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { PacienteService } from "../../app/services/paciente-service"
import { Loader2, CheckCircle, XCircle, Info, Server, Globe, Wifi, AlertTriangle } from "lucide-react"

export function ConnectionTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const addResult = (result: any) => {
    setResults((prev) => [...prev, { ...result, timestamp: new Date().toLocaleTimeString() }])
  }

  const clearResults = () => {
    setResults([])
  }

  const testBasicConnectivity = async () => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

      addResult({
        test: "Configuración",
        success: true,
        message: `URL configurada: ${apiUrl}`,
        details: {
          baseUrl: apiUrl,
          fullUrl: `${apiUrl}/api/pacientes`,
          environment: process.env.NODE_ENV || "development",
        },
      })

      // Test 1: Basic fetch to root
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          mode: "no-cors", // Avoid CORS for basic connectivity test
        })

        addResult({
          test: "Conectividad Básica",
          success: true,
          message: "El servidor responde",
          details: { status: response.status, type: response.type },
        })
      } catch (error: any) {
        addResult({
          test: "Conectividad Básica",
          success: false,
          message: `No se puede conectar al servidor: ${error.message}`,
        })
      }

      // Test 2: CORS preflight
      try {
        const response = await fetch(`${apiUrl}/api/pacientes`, {
          method: "OPTIONS",
          headers: {
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type",
          },
        })

        addResult({
          test: "CORS Preflight",
          success: response.ok,
          message: response.ok ? "CORS configurado correctamente" : `CORS error: ${response.status}`,
          details: {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
          },
        })
      } catch (error: any) {
        addResult({
          test: "CORS Preflight",
          success: false,
          message: `Error CORS: ${error.message}`,
        })
      }

      // Test 3: Actual API call
      const connectionResult = await PacienteService.testConnection()
      addResult({
        test: "API Pacientes",
        success: connectionResult.success,
        message: connectionResult.message,
        details: connectionResult.details,
      })
    } catch (error: any) {
      addResult({
        test: "Error General",
        success: false,
        message: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectBrowser = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/pacientes`
    window.open(url, "_blank")
    addResult({
      test: "Test Manual",
      success: true,
      message: `Abriendo ${url} en nueva pestaña`,
      details: { url },
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Test de Conectividad Completo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div>
                <strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
              </div>
              <div>
                <strong>API Endpoint:</strong>{" "}
                {(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/pacientes"}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={testBasicConnectivity} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Server className="mr-2 h-4 w-4" />}
            Test Completo
          </Button>
          <Button onClick={testDirectBrowser} variant="outline">
            <Globe className="mr-2 h-4 w-4" />
            Abrir en Navegador
          </Button>
          <Button onClick={clearResults} variant="secondary" disabled={results.length === 0}>
            Limpiar Resultados
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Resultados de las Pruebas:</h3>
            {results.map((result, index) => (
              <Alert key={index} variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{result.test}</Badge>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "✓ Éxito" : "✗ Error"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                    </div>
                    <div className="text-sm">{result.message}</div>
                    {result.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer">Ver detalles</summary>
                        <pre className="mt-1 p-2 bg-muted rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {results.length > 0 && !results[results.length - 1]?.success && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <strong>Pasos para solucionar:</strong>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Verifica que Spring Boot esté ejecutándose en el puerto correcto</li>
                  <li>
                    Prueba acceder directamente:{" "}
                    <code className="bg-muted px-1 rounded">
                      {(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/pacientes"}
                    </code>
                  </li>
                  <li>Configura CORS en tu backend Spring Boot</li>
                  <li>Verifica que no haya firewall bloqueando la conexión</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
