// src/pages/ServicioForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createServicio,
  getServicio,
  updateServicio
} from '../api';

export default function ServicioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    descripcion: '',
    precio: ''
  });

  useEffect(() => {
    if (isEdit) load();
  }, [id]);

  const load = async () => {
    const data = await getServicio(id);
    setForm({
      descripcion: data.descripcion,
      precio: data.precio
    });
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const payload = { 
      descripcion: form.descripcion, 
      precio: parseFloat(form.precio) 
    };
    if (isEdit) {
      await updateServicio(id, payload);
    } else {
      await createServicio(payload);
    }
    navigate('/servicios');
  };

  return (
    <div>
      <h2>{isEdit ? 'Editar' : 'Nuevo'} Servicio</h2>
      <form onSubmit={onSubmit}>
        <div style={{ margin: '8px 0' }}>
          <label style={{ width: 120, display: 'inline-block' }}>Descripción:</label>
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ margin: '8px 0' }}>
          <label style={{ width: 120, display: 'inline-block' }}>Precio:</label>
          <input
            name="precio"
            type="number"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Guardar</button>{' '}
        <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
      </form>
    </div>
  );
}
