import React, { useEffect, useState } from 'react';
import { listFacturas } from '../api';

export default function FacturaList() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    listFacturas().then(setFacturas);
  }, []);

  return (
    <div>
      <h2>Facturas</h2>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>NroFactura</th>
            <th>FechaEmisión</th>
            <th>ValorTotal</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.nroFactura}</td>
              <td>{new Date(f.fechaEmision).toLocaleString()}</td>
              <td>{f.valorTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
