import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  listPacientes,
  deletePaciente
} from '../api';

export default function PacienteList() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const data = await listPacientes();
    setPacientes(data);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Eliminar paciente?')) return;
    await deletePaciente(id);
    fetch();
  };

  return (
    <div>
      <h2>Pacientes</h2>
      <button onClick={() => navigate('/pacientes/nuevo')}>
        + Nuevo Paciente
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Documento</th>
            <th>Teléfono</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.documentoIdentidad}</td>
              <td>{p.telefono}</td>
              <td>
                <Link to={`/pacientes/${p.id}/editar`}>✎</Link>
                {' '}
                <button onClick={() => onDelete(p.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
