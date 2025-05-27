const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

/** PACIENTES */
export const createPaciente = (data) =>
  fetch(`${BASE}/pacientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())

export const listPacientes = () =>
  fetch(`${BASE}/pacientes`).then(res => res.json())

export const getPaciente = (id) =>
  fetch(`${BASE}/pacientes/${id}`).then(res => res.json())

export const updatePaciente = (id, data) =>
  fetch(`${BASE}/pacientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())

export const deletePaciente = (id) =>
  fetch(`${BASE}/pacientes/${id}`, { method: 'DELETE' })

/** SERVICIOS */
export const createServicio = (data) =>
  fetch(`${BASE}/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())

export const listServicios = () =>
  fetch(`${BASE}/servicios`).then(res => res.json())

export const getServicio = (id) =>
  fetch(`${BASE}/servicios/${id}`).then(res => res.json())

export const getServiciosPorTipo = (tipo) =>
  fetch(`${BASE}/servicios/tipo/${tipo}`).then(res => res.json())

export const updateServicio = (id, data) =>
  fetch(`${BASE}/servicios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())

export const deleteServicio = (id) =>
  fetch(`${BASE}/servicios/${id}`, { method: 'DELETE' })

/** PRODUCTOS */
export const createProducto = (data) =>
  fetch(`${BASE}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())

export const listProductos = () =>
  fetch(`${BASE}/productos`).then(res => res.json())

export const getProducto = (id) =>
  fetch(`${BASE}/productos/${id}`).then(res => res.json())

export const updateProducto = (id, data) =>
  fetch(`${BASE}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())

export const deleteProducto = (id) =>
  fetch(`${BASE}/productos/${id}`, { method: 'DELETE' })

/** DESCARGOS */
export const createDescargo = (data) =>
  fetch(`${BASE}/descargos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())

export const listDescargos = () =>
  fetch(`${BASE}/descargos`).then(res => res.json())

export const getDescargo = (id) =>
  fetch(`${BASE}/descargos/${id}`).then(res => res.json())

export const updateDescargo = (id, data) =>
  fetch(`${BASE}/descargos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())

export const deleteDescargo = (id) =>
  fetch(`${BASE}/descargos/${id}`, { method: 'DELETE' })

/** LÍNEAS de DESCARGO */
export const addLineaServicio = (descargoId, servicioId, cantidad) =>
  fetch(`${BASE}/descargos/${descargoId}/lineas/servicio?servicioId=${servicioId}&cantidad=${cantidad}`, {
    method: 'POST'
  }).then(res => res.json())

export const addLineaProducto = (descargoId, productoId, cantidad) =>
  fetch(`${BASE}/descargos/${descargoId}/lineas/producto?productoId=${productoId}&cantidad=${cantidad}`, {
    method: 'POST'
  }).then(res => res.json())

/** ESTADOS y FACTURACIÓN */
export const descargarDescargo = (descargoId) =>
  fetch(`${BASE}/documentos/descargos/${descargoId}/descargar`, { method: 'POST' })
    .then(res => res.json())

export const facturarDescargo = (descargoId) =>
  fetch(`${BASE}/documentos/descargos/${descargoId}/facturar`, { method: 'POST' })
    .then(res => res.json())

/** FACTURAS */
export const listFacturas = () =>
  fetch(`${BASE}/facturas`).then(res => res.json())

export const getFactura = (id) =>
  fetch(`${BASE}/facturas/${id}`).then(res => res.json())

export const deleteFactura = (id) =>
  fetch(`${BASE}/facturas/${id}`, { method: 'DELETE' })






