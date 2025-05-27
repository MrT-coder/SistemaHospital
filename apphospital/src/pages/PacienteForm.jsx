import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPaciente, getPaciente, updatePaciente, listPacientes, deletePaciente } from '../api';

export default function PacienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nombre: '',
    documentoIdentidad: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    if (isEdit) load();
  }, [id]);

  const load = async () => {
    const data = await getPaciente(id);
    setForm({
      nombre: data.nombre,
      documentoIdentidad: data.documentoIdentidad,
      fechaNacimiento: data.fechaNacimiento,
      telefono: data.telefono,
      direccion: data.direccion
    });
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (isEdit) {
      await updatePaciente(id, form);
    } else {
      await createPaciente(form);
    }
    navigate('/pacientes');
  };

  return (
    <div>
      <h2>{isEdit ? 'Editar' : 'Nuevo'} Paciente</h2>
      <form onSubmit={onSubmit}>
        {[
          { name: 'nombre', label: 'Nombre' },
          { name: 'documentoIdentidad', label: 'Documento' },
          { name: 'fechaNacimiento', label: 'Nacimiento', type: 'date' },
          { name: 'telefono', label: 'Teléfono' },
          { name: 'direccion', label: 'Dirección' }
        ].map(f => (
          <div key={f.name} style={{ margin: '8px 0' }}>
            <label style={{ width: 120, display: 'inline-block' }}>
              {f.label}:
            </label>
            <input
              type={f.type || 'text'}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Guardar</button>
        <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
      </form>
    </div>
  );
}
