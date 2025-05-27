// src/pages/ServicioList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listServicios, deleteServicio } from '../api';

export default function ServicioList() {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    const data = await listServicios();
    setServicios(data);
  };

  const onDelete = async (id) => {
    if (!window.confirm('¿Eliminar servicio?')) return;
    await deleteServicio(id);
    fetchServicios();
  };

  return (
    <div>
      <h2>Catálogo de Servicios</h2>
      <button onClick={() => navigate('/servicios/nuevo')}>
        + Nuevo Servicio
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th><th>Descripción</th><th>Precio</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.descripcion}</td>
              <td>{s.precio}</td>
              <td>
                <Link to={`/servicios/${s.id}/editar`}>✎</Link>{' '}
                <button onClick={() => onDelete(s.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
