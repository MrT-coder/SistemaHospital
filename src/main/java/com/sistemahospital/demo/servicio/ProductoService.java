package com.sistemahospital.demo.servicio;

import java.util.List;
import java.util.Optional;

import com.sistemahospital.demo.modelo.Producto;

public interface ProductoService {
    List<Producto> findAll();
    Optional<Producto> findById(Long id);
    List<Producto> findByTipo(String tipo);
    Producto save(Producto producto);
    Optional<Producto> update(Long id, Producto cambios);
    void delete(Long id);
}