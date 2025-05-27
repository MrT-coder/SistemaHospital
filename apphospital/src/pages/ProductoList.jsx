import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listProductos, deleteProducto } from '../api';

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const data = await listProductos();
    setProductos(data);
  };

  const onDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    await deleteProducto(id);
    fetchProductos();
  };

  return (
    <div>
      <h2>Catálogo de Productos</h2>
      <button onClick={() => navigate('/productos/nuevo')}>
        + Nuevo Producto
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th><th>Descripción</th><th>Precio</th><th>Categoría</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.descripcion}</td>
              <td>{p.precio}</td>
              <td>{p.categoria}</td>
              <td>
                <Link to={`/productos/${p.id}/editar`}>✎</Link>{' '}
                <button onClick={() => onDelete(p.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
