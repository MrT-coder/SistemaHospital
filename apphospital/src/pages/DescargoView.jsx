import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getDescargo,
  addLineaServicio,
  addLineaProducto
} from '../api';

export default function DescargoView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [descargo, setDescargo] = useState(null);
  const [servicioId, setServicioId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setDescargo(await getDescargo(id));
  };

  const onAddServicio = async () => {
    await addLineaServicio(id, servicioId, cantidad);
    load();
  };
  const onAddProducto = async () => {
    await addLineaProducto(id, productoId, cantidad);
    load();
  };

  if (!descargo) return <div>Cargando…</div>;

  return (
    <div>
      <h2>Descargo #{descargo.nro}</h2>
      <p>Fecha: {new Date(descargo.fecha).toLocaleString()}</p>
      <p>Paciente: {descargo.paciente.id} – {descargo.paciente.nombre}</p>
      <p>Total: {descargo.valorTotal}</p>
      <h3>Líneas</h3>
      <ul>
        {descargo.lineas.map(l=>(
          <li key={l.id}>
            {l.subtotal} ({l.cantidad}×{l.precioUnitario}) —{' '}
            {l.productoId ? `Prod#${l.productoId}` : `Serv#${l.servicioId}`}
          </li>
        ))}
      </ul>

      <div style={{marginTop:20}}>
        <h4>Agregar Servicio</h4>
        <input
          placeholder="servicioId"
          value={servicioId}
          onChange={e=>setServicioId(e.target.value)}
        />
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={e=>setCantidad(e.target.value)}
        />
        <button onClick={onAddServicio}>+ Servicio</button>
      </div>

      <div style={{marginTop:20}}>
        <h4>Agregar Producto</h4>
        <input
          placeholder="productoId"
          value={productoId}
          onChange={e=>setProductoId(e.target.value)}
        />
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={e=>setCantidad(e.target.value)}
        />
        <button onClick={onAddProducto}>+ Producto</button>
      </div>

      <div style={{marginTop:20}}>
        <button onClick={()=>nav('/descargos')}>← Volver</button>
        {descargo.estado==='PENDIENTE' &&
          <Link to={`/descargos/${id}/facturar`}>Facturar →</Link>
        }
      </div>
    </div>
  );
}
