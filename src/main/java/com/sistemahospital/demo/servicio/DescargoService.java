package com.sistemahospital.demo.servicio;

import java.util.List;
import java.util.Optional;

import com.sistemahospital.demo.modelo.Descargo;

public interface DescargoService {
    List<Descargo> findAll();
    Optional<Descargo> findById(Long id);
    Descargo save(Descargo descargo);
    Optional<Descargo> update(Long id, Descargo cambios);
    void delete(Long id);
}
