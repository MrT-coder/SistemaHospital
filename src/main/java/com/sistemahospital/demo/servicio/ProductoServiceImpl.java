package com.sistemahospital.demo.servicio;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public List<Producto> findByCategoria(String categoria) {
        return repo.findAll()
                   .stream()
                   .filter(p -> p.getCategoria().equalsIgnoreCase(categoria))
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
                existing.setCategoria(cambios.getCategoria());
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
        if (p.getCategoria() == null || p.getCategoria().isBlank()) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }
    }
}
