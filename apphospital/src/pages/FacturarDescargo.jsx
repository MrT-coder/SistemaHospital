import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getDescargo, facturarDescargo } from '../api';

export default function FacturarDescargo() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [descargo, setDescargo] = useState(null);
  const [factura,  setFactura]  = useState(null);
  const [loading,  setLoading]  = useState(true);

  // Carga datos del descargo
  useEffect(() => {
    getDescargo(id).then(d => {
      setDescargo(d);
      setLoading(false);
    });
  }, [id]);

  const onFacturar = async () => {
    const fac = await facturarDescargo(id);
    setFactura(fac);
  };

  if (loading) return <div>Cargando descargo…</div>;

  return (
    <div>
      <h2>Facturar Descargo #{descargo.nro}</h2>
      <p><strong>Fecha:</strong> {new Date(descargo.fecha).toLocaleString()}</p>
      <p><strong>Paciente:</strong> {descargo.paciente.id} – {descargo.paciente.nombre}</p>
      <p><strong>Total:</strong> {descargo.valorTotal}</p>

      {!factura ? (
        <button onClick={onFacturar}>
          ▶️ Generar Factura
        </button>
      ) : (
        <div style={{ marginTop: 20 }}>
          <h3>Factura Generada</h3>
          <p><strong>ID:</strong> {factura.id}</p>
          <p><strong>NroFactura:</strong> {factura.nroFactura}</p>
          <p><strong>FechaEmisión:</strong> {new Date(factura.fechaEmision).toLocaleString()}</p>
          <p><strong>ValorTotal:</strong> {factura.valorTotal}</p>
          <Link to="/facturas">→ Ver todas las facturas</Link>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate(-1)}>← Volver</button>
      </div>
    </div>
  );
}
