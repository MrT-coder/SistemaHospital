package com.sistemahospital.demo.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sistemahospital.demo.modelo.Descargo;
import com.sistemahospital.demo.modelo.EstadoDocumento;
import com.sistemahospital.demo.repositorio.DescargoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class DescargoServiceImpl implements DescargoService {

    private final DescargoRepository repo;

    public DescargoServiceImpl(DescargoRepository repo) {
        this.repo = repo;
    }

    public List<Descargo> findAll() {
        return repo.findAll();
    }

    public Optional<Descargo> findById(Long id) {
        return repo.findById(id);
    }

    public Descargo save(Descargo descargo) {
        // puedes inicializar estado PENDIENTE aquí
        descargo.setEstado(EstadoDocumento.PENDIENTE);
        return repo.save(descargo);
    }

    public Optional<Descargo> update(Long id, Descargo cambios) {
        return repo.findById(id).map(existing -> {
            existing.setFecha(cambios.getFecha());
            existing.setPaciente(cambios.getPaciente());
            // otros campos si los hay
            return repo.save(existing);
        });
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}