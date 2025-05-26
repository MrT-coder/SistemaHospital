package com.sistemahospital.demo.servicio;


import java.util.List;
import java.util.Optional;

import com.sistemahospital.demo.modelo.Paciente;

public interface PacienteService {
    List<Paciente> findAll();
    Optional<Paciente> findById(Long id);
    Paciente save(Paciente paciente);
    Paciente update(Long id, Paciente paciente);
    void delete(Long id);
}