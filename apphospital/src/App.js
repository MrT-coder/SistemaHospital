import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PacienteList      from './pages/PacienteList.jsx';
import PacienteForm      from './pages/PacienteForm.jsx';
import ServicioList      from './pages/ServicioList.jsx';
import ServicioForm      from './pages/ServicioForm.jsx';
import ProductoList      from './pages/ProductoList.jsx';
import ProductoForm      from './pages/ProductoForm.jsx';
import DescargoList      from './pages/DescargoList.jsx';
import DescargoForm      from './pages/DescargoForm.jsx';
import DescargoView      from './pages/DescargoView.jsx';
import FacturarDescargo  from './pages/FacturarDescargo.jsx';
import FacturaList       from './pages/FacturarList.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pacientes" replace />} />

        <Route path="/pacientes" element={<PacienteList />} />
        <Route path="/pacientes/nuevo" element={<PacienteForm />} />
        <Route path="/pacientes/:id/editar" element={<PacienteForm />} />

        <Route path="/servicios" element={<ServicioList />} />
        <Route path="/servicios/nuevo" element={<ServicioForm />} />
        <Route path="/servicios/:id/editar" element={<ServicioForm />} />

        <Route path="/productos" element={<ProductoList />} />
        <Route path="/productos/nuevo" element={<ProductoForm />} />
        <Route path="/productos/:id/editar" element={<ProductoForm />} />

        <Route path="/descargos" element={<DescargoList />} />
        <Route path="/descargos/nuevo" element={<DescargoForm />} />
        <Route path="/descargos/:id/editar" element={<DescargoForm />} />
        <Route path="/descargos/:id" element={<DescargoView />} />

        <Route path="/descargos/:id/facturar" element={<FacturarDescargo />} />
        <Route path="/facturas" element={<FacturaList />} />

        {/* Ruta comodín para 404 */}
        <Route path="*" element={<h2>404 – Página no encontrada</h2>} />
      </Routes>
    </Layout>
  );
}