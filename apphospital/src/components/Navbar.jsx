import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd'
    }}>
      <Link to="/pacientes">Pacientes</Link>
      <Link to="/servicios">Servicios</Link>
      <Link to="/productos">Productos</Link>
      <Link to="/descargos">Descargos</Link>
      <Link to="/facturas">Facturas</Link>
    </nav>
  );
}
