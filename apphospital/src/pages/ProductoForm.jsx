import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProducto,
  getProducto,
  updateProducto
} from '../api';

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    descripcion: '',
    precio: '',
    categoria: 'MEDICINA'
  });

  useEffect(() => {
    if (isEdit) load();
  }, [id]);

  const load = async () => {
    const data = await getProducto(id);
    setForm({
      descripcion: data.descripcion,
      precio: data.precio,
      categoria: data.categoria
    });
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const payload = {
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      categoria: form.categoria
    };
    if (isEdit) {
      await updateProducto(id, payload);
    } else {
      await createProducto(payload);
    }
    navigate('/productos');
  };

  return (
    <div>
      <h2>{isEdit ? 'Editar' : 'Nuevo'} Producto</h2>
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
        <div style={{ margin: '8px 0' }}>
          <label style={{ width: 120, display: 'inline-block' }}>Categoría:</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
          >
            <option value="MEDICINA">MEDICINA</option>
            <option value="COMIDA">COMIDA</option>
            <option value="HOSPEDAJE">HOSPEDAJE</option>
          </select>
        </div>
        <button type="submit">Guardar</button>{' '}
        <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
      </form>
    </div>
  );
}
