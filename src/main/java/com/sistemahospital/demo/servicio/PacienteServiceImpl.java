package com.sistemahospital.demo.servicio;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemahospital.demo.modelo.Paciente;
import com.sistemahospital.demo.repositorio.PacienteRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository repo;

    public PacienteServiceImpl(PacienteRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Paciente> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Paciente> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Paciente save(Paciente paciente) {
        return repo.save(paciente);
    }

    @Override
    public Paciente update(Long id, Paciente paciente) {
        return repo.findById(id)
            .map(existing -> {
                existing.setNombre(paciente.getNombre());
                existing.setDocumentoIdentidad(paciente.getDocumentoIdentidad());
                existing.setFechaNacimiento(paciente.getFechaNacimiento());
                existing.setTelefono(paciente.getTelefono());
                existing.setDireccion(paciente.getDireccion());
                return repo.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Paciente no encontrado: " + id));
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}