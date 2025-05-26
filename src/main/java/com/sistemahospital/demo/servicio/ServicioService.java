package com.sistemahospital.demo.servicio;

import java.util.List;
import java.util.Optional;

import com.sistemahospital.demo.modelo.Servicio;

public interface ServicioService {
    List<Servicio> findAll();
    Optional<Servicio> findById(Long id);
    List<Servicio> findByTipo(String tipo);      
    Servicio save(Servicio servicio);
    Optional<Servicio> update(Long id, Servicio cambios);
    void delete(Long id);
}