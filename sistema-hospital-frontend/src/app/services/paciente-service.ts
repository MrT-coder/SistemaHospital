import type { Paciente, PacienteFormData } from "../types/paciente"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export class PacienteService {
  private static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<{ data: T; error: null } | { data: null; error: string }> {
    try {
      console.log(`🌐 Haciendo petición a: ${url}`)
      console.log(`📋 Opciones:`, options)

      // Add timeout to the request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const defaultOptions: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        cache: "no-cache",
        signal: controller.signal,
      }

      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      console.log(`📡 Respuesta recibida:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorText = await response.text()
          if (errorText) {
            errorMessage += ` - ${errorText}`
          }
        } catch (e) {
          console.warn("No se pudo leer el texto del error")
        }
        return { data: null, error: errorMessage }
      }

      // Handle empty responses (like DELETE)
      if (response.status === 204) {
        return { data: {} as T, error: null }
      }

      const data = await response.json()
      console.log(`✅ Datos procesados:`, data)
      return { data, error: null }
    } catch (error: any) {
      console.error(`🚨 Error en petición:`, error)

      let errorMessage = "Error desconocido"

      if (error.name === "AbortError") {
        errorMessage = "Timeout: El servidor no responde (más de 15 segundos)"
      } else if (error instanceof TypeError) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = `No se puede conectar al servidor en ${API_BASE_URL}

Posibles causas:
• El servidor Spring Boot no está ejecutándose
• Problema de CORS en el backend
• URL incorrecta: ${url}
• Firewall o proxy bloqueando la conexión
• El servidor está en una red diferente

Soluciones:
1. Verifica que Spring Boot esté corriendo
2. Configura CORS en el backend
3. Prueba acceder directamente: ${url}`
        } else if (error.message.includes("NetworkError")) {
          errorMessage = "Error de red: Verifica tu conexión a internet"
        } else {
          errorMessage = `Error de red: ${error.message}`
        }
      } else {
        errorMessage = error.message || "Error desconocido"
      }

      return { data: null, error: errorMessage }
    }
  }

  static async getAll(): Promise<Paciente[]> {
    const url = `${API_BASE_URL}/api/pacientes`
    const result = await this.makeRequest<Paciente[]>(url, {
      method: "GET",
    })

    if (result.error) {
      throw new Error(result.error)
    }

    if (!Array.isArray(result.data)) {
      console.warn("⚠️ Los datos recibidos no son un array:", result.data)
      return []
    }

    return result.data
  }

  static async getById(id: number): Promise<Paciente> {
    const url = `${API_BASE_URL}/api/pacientes/${id}`
    const result = await this.makeRequest<Paciente>(url, {
      method: "GET",
    })

    if (result.error) {
      throw new Error(result.error)
    }

    return result.data!
  }

  static async create(paciente: PacienteFormData): Promise<Paciente> {
    const url = `${API_BASE_URL}/api/pacientes`
    const result = await this.makeRequest<Paciente>(url, {
      method: "POST",
      body: JSON.stringify(paciente),
    })

    if (result.error) {
      throw new Error(result.error)
    }

    return result.data!
  }

  static async update(id: number, paciente: PacienteFormData): Promise<Paciente> {
    const url = `${API_BASE_URL}/api/pacientes/${id}`
    const result = await this.makeRequest<Paciente>(url, {
      method: "PUT",
      body: JSON.stringify(paciente),
    })

    if (result.error) {
      throw new Error(result.error)
    }

    return result.data!
  }

  static async delete(id: number): Promise<void> {
    const url = `${API_BASE_URL}/api/pacientes/${id}`
    const result = await this.makeRequest<void>(url, {
      method: "DELETE",
    })

    if (result.error) {
      throw new Error(result.error)
    }
  }

  // Método para probar conectividad básica
  static async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const url = `${API_BASE_URL}/api/pacientes`
      const result = await this.makeRequest<Paciente[]>(url, {
        method: "GET",
      })

      if (result.error) {
        return {
          success: false,
          message: result.error,
        }
      }

      return {
        success: true,
        message: `Conexión exitosa. Se encontraron ${result.data?.length || 0} pacientes.`,
        details: {
          count: result.data?.length || 0,
          url: url,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
}
