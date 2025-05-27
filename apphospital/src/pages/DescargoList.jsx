// src/pages/DescargoList.jsx
import React, { useEffect, useState } from 'react';
import { listDescargos } from '../api';

export default function DescargoList() {
  const [descargos, setDescargos] = useState([]);    // 1) array vacío
  const [loading, setLoading]     = useState(true);  // 2) control de carga
  const [error, setError]         = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await listDescargos();
        setDescargos(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los descargos');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Cargando descargos…</div>;
  if (error)   return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Descargos</h2>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente ID</th>
            <th>Paciente Nombre</th>
            <th>Nro</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {descargos.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.paciente?.id ?? '—'}</td>            {/* 3) optional chaining */}
              <td>{d.paciente?.nombre ?? '—'}</td>
              <td>{d.nro}</td>
              <td>{new Date(d.fecha).toLocaleString()}</td>
              <td>{d.valorTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
