import type {
  Descargo,
  DescargoFormData,
  DescargoUpdateData,
  Linea,
  LineaServicioFormData,
  LineaProductoFormData,
} from "../../app/types/descargo"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export class DescargoService {
  private static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<{ data: T; error: null } | { data: null; error: string }> {
    try {
      console.log(`🌐 Haciendo petición a: ${url}`)
      console.log(`📋 Opciones:`, options)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

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

Soluciones:
1. Verifica que Spring Boot esté corriendo
2. Configura CORS en el backend
3. Prueba acceder directamente: ${url}`
        } else {
          errorMessage = `Error de red: ${error.message}`
        }
      } else {
        errorMessage = error.message || "Error desconocido"
      }

      return { data: null, error: errorMessage }
    }
  }

  // Función auxiliar para enriquecer descargos con información del paciente
  private static async enrichDescargoWithPaciente(descargo: Descargo): Promise<Descargo> {
    try {
      // Importar PacienteService aquí para evitar dependencias circulares
      const { PacienteService } = await import("./paciente-service")
      const paciente = await PacienteService.getById(descargo.pacienteId)
      return {
        ...descargo,
        paciente: {
          id: paciente.id!,
          nombre: paciente.nombre,
          documentoIdentidad: paciente.documentoIdentidad,
        },
      }
    } catch (error) {
      console.warn("No se pudo cargar información del paciente:", error)
      return descargo
    }
  }

  // Operaciones CRUD básicas
  static async getAll(): Promise<Descargo[]> {
    const url = `${API_BASE_URL}/api/descargos`
    const result = await this.makeRequest<Descargo[]>(url, {
      method: "GET",
    })

    if (result.error) {
      throw new Error(result.error)
    }

    if (!Array.isArray(result.data)) {
      console.warn("⚠️ Los datos recibidos no son un array:", result.data)
      return []
    }

    // Enriquecer cada descargo con información del paciente
    const enrichedDescargos = await Promise.all(
      result.data.map((descargo) => this.enrichDescargoWithPaciente(descargo)),
    )

    return enrichedDescargos
  }

  static async getById(id: number): Promise<Descargo> {
    const url = `${API_BASE_URL}/api/descargos/${id}`
    const result = await this.makeRequest<Descargo>(url, {
      method: "GET",
    })

    if (result.error) {
      throw new Error(result.error)
    }

    // Enriquecer con información del paciente
    return await this.enrichDescargoWithPaciente(result.data!)
  }

  static async create(descargo: DescargoFormData): Promise<Descargo> {
    const url = `${API_BASE_URL}/api/descargos`

    // Convertir el formato para el backend
    const backendData = {
      nro: descargo.nro,
      fecha: descargo.fecha,
      paciente: { id: descargo.pacienteId },
    }

    const result = await this.makeRequest<Descargo>(url, {
      method: "POST",
      body: JSON.stringify(backendData),
    })

    if (result.error) {
      throw new Error(result.error)
    }

    return await this.enrichDescargoWithPaciente(result.data!)
  }

  static async update(id: number, descargo: DescargoUpdateData): Promise<Descargo> {
    const url = `${API_BASE_URL}/api/descargos/${id}`
    const result = await this.makeRequest<Descargo>(url, {
      method: "PUT",
      body: JSON.stringify(descargo),
    })

    if (result.error) {
      throw new Error(result.error)
    }

    return await this.enrichDescargoWithPaciente(result.data!)
  }

  static async delete(id: number): Promise<void> {
    const url = `${API_BASE_URL}/api/descargos/${id}`
    const result = await this.makeRequest<void>(url, {
      method: "DELETE",
    })

    if (result.error) {
      throw new Error(result.error)
    }
  }

  // Operaciones para líneas de servicios
  static async addLineaServicio(descargoId: number, lineaData: LineaServicioFormData): Promise<Linea> {
    const url = `${API_BASE_URL}/api/descargos/${descargoId}/lineas/servicio?servicioId=${lineaData.servicioId}&cantidad=${lineaData.cantidad}`
    const result = await this.makeRequest<Linea>(url, {
      method: "POST",
    })

    if (result.error) {
      throw new Error(result.error)
    }

    return result.data!
  }

  // Operaciones para líneas de productos
  static async addLineaProducto(descargoId: number, lineaData: LineaProductoFormData): Promise<Linea> {
    const url = `${API_BASE_URL}/api/descargos/${descargoId}/lineas/producto?productoId=${lineaData.productoId}&cantidad=${lineaData.cantidad}`
    const result = await this.makeRequest<Linea>(url, {
      method: "POST",
    })

    if (result.error) {
      throw new Error(result.error)
    }

    return result.data!
  }

  static async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const url = `${API_BASE_URL}/api/descargos`
      const result = await this.makeRequest<Descargo[]>(url, {
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
        message: `Conexión exitosa. Se encontraron ${result.data?.length || 0} descargos.`,
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
