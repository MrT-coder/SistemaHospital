package com.sistemahospital.demo.servicio;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemahospital.demo.catalogo.AtencionMedica;
import com.sistemahospital.demo.catalogo.ExamenLab;
import com.sistemahospital.demo.catalogo.ImagenRayosX;
import com.sistemahospital.demo.catalogo.ProcedimientoMedico;
import com.sistemahospital.demo.modelo.Servicio;
import com.sistemahospital.demo.repositorio.ServicioRepository;

@Service
@Transactional
public class ServicioServiceImpl implements ServicioService {

    private final ServicioRepository repo;

    public ServicioServiceImpl(ServicioRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Servicio> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Servicio> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<Servicio> findByTipo(String tipo) {
        return repo.findAll()
                .stream()
                .filter(s -> s.getClass().getSimpleName().equalsIgnoreCase(tipo))
                .collect(Collectors.toList());
    }

    @Override
    public Servicio save(Servicio servicio) {
        validate(servicio);
        return repo.save(servicio);
    }

    @Override
    public Optional<Servicio> update(Long id, Servicio cambios) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setDescripcion(cambios.getDescripcion());
                    existing.setPrecio(cambios.getPrecio());

                    // Campos de subclase
                    if (existing instanceof AtencionMedica && cambios instanceof AtencionMedica) {
                        AtencionMedica orig = (AtencionMedica) existing;
                        AtencionMedica mod = (AtencionMedica) cambios;
                        orig.setDuracion(mod.getDuracion());
                        orig.setMedico(mod.getMedico());
                    } else if (existing instanceof ExamenLab && cambios instanceof ExamenLab) {
                        ExamenLab orig = (ExamenLab) existing;
                        ExamenLab mod = (ExamenLab) cambios;
                        orig.setTipoExamen(mod.getTipoExamen());
                    } else if (existing instanceof ImagenRayosX && cambios instanceof ImagenRayosX) {
                        ImagenRayosX orig = (ImagenRayosX) existing;
                        ImagenRayosX mod = (ImagenRayosX) cambios;
                        orig.setRegion(mod.getRegion());
                    } else if (existing instanceof ProcedimientoMedico && cambios instanceof ProcedimientoMedico) {
                        ProcedimientoMedico orig = (ProcedimientoMedico) existing;
                        ProcedimientoMedico mod = (ProcedimientoMedico) cambios;
                        orig.setNombreProcedimiento(mod.getNombreProcedimiento());
                    }

                    validate(existing);
                    return repo.save(existing);
                });
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    private void validate(Servicio s) {
        if (s.getDescripcion() == null || s.getDescripcion().isBlank()) {
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        if (s.getPrecio() == null || s.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
    }
}