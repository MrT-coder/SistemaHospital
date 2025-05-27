import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createDescargo,
  getDescargo,
  updateDescargo,
  listPacientes
} from '../api';

export default function DescargoForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    nro: '',
    fecha: new Date().toISOString().slice(0,16),
    paciente: { id: '' }
  });

  useEffect(() => {
    listPacientes().then(setPacientes);
    if (isEdit) load();
  }, [id]);

  const load = async () => {
    const d = await getDescargo(id);
    setForm({
      nro: d.nro,
      fecha: d.fecha.slice(0,16),
      paciente: { id: d.paciente.id }
    });
  };

  const onChange = e => {
    const { name, value } = e.target;
    if (name==='paciente') setForm(f=>({ ...f, paciente:{ id: value } }));
    else setForm(f=>({ ...f, [name]: value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    const payload = {
      nro: form.nro,
      fecha: form.fecha,
      paciente: { id: parseInt(form.paciente.id) }
    };
    if (isEdit) await updateDescargo(id, payload);
    else await createDescargo(payload);
    nav('/descargos');
  };

  return (
    <div>
      <h2>{isEdit ? 'Editar' : 'Nuevo'} Descargo</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Nro:</label>
          <input name="nro" value={form.nro} onChange={onChange} required/>
        </div>
        <div>
          <label>Fecha:</label>
          <input type="datetime-local" name="fecha"
            value={form.fecha} onChange={onChange} required/>
        </div>
        <div>
          <label>Paciente:</label>
          <select name="paciente" value={form.paciente.id} onChange={onChange}>
            <option value="">-- elegir --</option>
            {pacientes.map(p=>(
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit">Guardar</button>{' '}
        <button type="button" onClick={()=>nav(-1)}>Cancelar</button>
      </form>
    </div>
  );
}
