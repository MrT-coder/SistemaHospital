package com.sistemahospital.demo.servicio;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemahospital.demo.catalogo.Comida;
import com.sistemahospital.demo.catalogo.Medicina;
import com.sistemahospital.demo.catalogo.CuartoHospital;
import com.sistemahospital.demo.modelo.Producto;
import com.sistemahospital.demo.repositorio.ProductoRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository repo;

    public ProductoServiceImpl(ProductoRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Producto> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Producto> findById(Long id) {
        return repo.findById(id);
    }

     @Override
    public List<Producto> findByTipo(String tipo) {
        return repo.findAll()
                .stream()
                .filter(p -> p.getClass().getSimpleName().equalsIgnoreCase(tipo))
                .collect(Collectors.toList());
    }

    @Override
    public Producto save(Producto producto) {
        validate(producto);
        return repo.save(producto);
    }

    @Override
    public Optional<Producto> update(Long id, Producto cambios) {
        return repo.findById(id)
            .map(existing -> {
                existing.setDescripcion(cambios.getDescripcion());
                existing.setPrecio(cambios.getPrecio());

                // Campos de subclase
                 if (existing instanceof Comida && cambios instanceof Comida) {
                        Comida orig = (Comida) existing;
                        Comida mod = (Comida) cambios;
                        orig.setValorNutricional(mod.getValorNutricional());
                        orig.setTipoComida(mod.getTipoComida());
                    } else if (existing instanceof Medicina && cambios instanceof Medicina) {
                        Medicina orig = (Medicina) existing;
                        Medicina mod = (Medicina) cambios;
                        orig.setLaboratorio(mod.getLaboratorio());
                        orig.setDosis(mod.getDosis());
                    } else if (existing instanceof CuartoHospital && cambios instanceof CuartoHospital) {
                        CuartoHospital orig = (CuartoHospital) existing;
                        CuartoHospital mod = (CuartoHospital) cambios;
                        orig.setNumeroHabitacion(mod.getNumeroHabitacion());
                        orig.setFechaCheckIn(mod.getFechaCheckIn());
                        orig.setFechaCheckOut(mod.getFechaCheckOut());
                    } 
                validate(existing);
                return repo.save(existing);
            });
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    private void validate(Producto p) {
        if (p.getDescripcion() == null || p.getDescripcion().isBlank()) {
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        if (p.getPrecio() == null || p.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
    }
}
